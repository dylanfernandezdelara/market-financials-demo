import { createHmac, timingSafeEqual } from "node:crypto";
import http from "node:http";

import { loadConfig } from "./config.mjs";
import { DevinClient } from "./devin-client.mjs";
import { GiteaClient } from "./gitea-client.mjs";
import { buildSessionPrompt } from "./prompt.mjs";
import { JsonStateStore } from "./state-store.mjs";

const ACTIVE_STATUSES = new Set(["starting", "active"]);
const TERMINAL_SESSION_STATUSES = new Set(["exit", "error", "suspended"]);

function log(level, message, fields = {}) {
  const payload = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...fields,
  };

  const line = JSON.stringify(payload);

  if (level === "error") {
    console.error(line);
    return;
  }

  console.log(line);
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(`${JSON.stringify(payload)}\n`);
}

function extractIssueNumber(issue) {
  return issue?.number ?? issue?.index ?? null;
}

function extractIssueLabels(issue) {
  if (!Array.isArray(issue?.labels)) {
    return [];
  }

  return issue.labels
    .map((label) => label?.name)
    .filter((labelName) => typeof labelName === "string" && labelName.length > 0);
}

function extractPrimaryPrUrl(session) {
  if (!Array.isArray(session.pull_requests)) {
    return null;
  }

  for (const pullRequest of session.pull_requests) {
    if (typeof pullRequest?.pr_url === "string" && pullRequest.pr_url.length > 0) {
      return pullRequest.pr_url;
    }

    if (typeof pullRequest?.url === "string" && pullRequest.url.length > 0) {
      return pullRequest.url;
    }
  }

  return null;
}

function buildIssueUrl(baseUrl, owner, repo, issueNumber, providedUrl) {
  if (providedUrl) {
    return providedUrl;
  }

  return `${baseUrl}/${owner}/${repo}/issues/${issueNumber}`;
}

function getWebhookSignature(rawBody, secret) {
  return createHmac("sha256", secret).update(rawBody).digest("hex");
}

function signaturesMatch(a, b) {
  if (!a || !b) {
    return false;
  }

  const aBuffer = Buffer.from(a, "utf8");
  const bBuffer = Buffer.from(b, "utf8");

  if (aBuffer.length !== bBuffer.length) {
    return false;
  }

  return timingSafeEqual(aBuffer, bBuffer);
}

function shouldTriggerSession({ eventName, eventType, payload, triggerLabel }) {
  const normalizedEventType = String(eventType ?? "").toLowerCase();
  const isIssueLabelEvent =
    eventName === "issue_label" ||
    normalizedEventType === "issue_label" ||
    normalizedEventType === "issues.label";

  if (eventName !== "issues" && !isIssueLabelEvent) {
    return { shouldTrigger: false, reason: "unsupported_event" };
  }

  const action = String(payload?.action ?? "").toLowerCase();
  const issueLabels = extractIssueLabels(payload?.issue);
  const hasTriggerLabel = issueLabels.includes(triggerLabel);
  const webhookLabel = payload?.label?.name;
  const isLabelMutation =
    action === "labeled" || action === "label_updated" || action.includes("label");

  if (!isLabelMutation) {
    return { shouldTrigger: false, reason: "not_a_label_event" };
  }

  if (!isIssueLabelEvent && eventName === "issues" && webhookLabel !== triggerLabel) {
    return { shouldTrigger: false, reason: "different_label" };
  }

  if (!hasTriggerLabel) {
    return { shouldTrigger: false, reason: "label_not_present_after_event" };
  }

  return { shouldTrigger: true, reason: "trigger_label_added" };
}

async function readRawBody(request) {
  const chunks = [];

  for await (const chunk of request) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks);
}

function buildIssueRecord(config, payload, deliveryId) {
  const owner =
    payload?.repository?.owner?.username ||
    payload?.repository?.owner?.login ||
    payload?.repository?.full_name?.split("/")[0];
  const repo = payload?.repository?.name;
  const issueNumber = extractIssueNumber(payload?.issue);

  if (!owner || !repo || !issueNumber) {
    throw new Error("Webhook payload is missing repository or issue identity fields");
  }

  return {
    owner,
    repo,
    issueNumber,
    title: payload.issue.title || `Issue #${issueNumber}`,
    body: payload.issue.body || "",
    url: buildIssueUrl(config.gitea.baseUrl, owner, repo, issueNumber, payload.issue.html_url),
    labels: extractIssueLabels(payload.issue),
    deliveryId,
  };
}

function buildSessionTags(issue) {
  return [
    "gitea",
    `${issue.owner}/${issue.repo}`,
    `issue-${issue.issueNumber}`,
    `gitea-delivery-${issue.deliveryId}`,
  ].filter((tag) => !tag.endsWith("-"));
}

function buildSessionComment(record) {
  return `Started Devin session: ${record.sessionUrl}

<!-- devin-bridge:session:${record.sessionId} -->`;
}

function buildPrComment(record) {
  return `Devin opened a PR: ${record.prUrl}

<!-- devin-bridge:pr:${record.sessionId} -->`;
}

async function ensureComment({
  giteaClient,
  store,
  issueKey,
  record,
  marker,
  commentBody,
  successField,
}) {
  const comments = await giteaClient.listIssueComments({
    owner: record.owner,
    repo: record.repo,
    issueNumber: record.issueNumber,
  });

  const existingComment = comments.find(
    (comment) => typeof comment?.body === "string" && comment.body.includes(marker),
  );

  if (existingComment) {
    if (!record[successField]) {
      await store.patchIssue(issueKey, {
        [successField]: new Date().toISOString(),
      });
    }
    return;
  }

  await giteaClient.createIssueComment({
    owner: record.owner,
    repo: record.repo,
    issueNumber: record.issueNumber,
    body: commentBody,
  });

  await store.patchIssue(issueKey, {
    [successField]: new Date().toISOString(),
  });
}

async function main() {
  const config = loadConfig();
  const stateStore = new JsonStateStore(config.stateFile, config.maxRecentDeliveries);
  const devinClient = new DevinClient({
    baseUrl: config.devin.baseUrl,
    orgId: config.devin.orgId,
    token: config.devin.apiToken,
    timeoutMs: config.httpTimeoutMs,
  });
  const giteaClient = new GiteaClient({
    baseUrl: config.gitea.baseUrl,
    token: config.gitea.token,
    timeoutMs: config.httpTimeoutMs,
  });

  await stateStore.init();

  const pollHandles = new Map();

  const cancelPoll = (issueKey) => {
    const handle = pollHandles.get(issueKey);

    if (handle) {
      clearTimeout(handle);
      pollHandles.delete(issueKey);
    }
  };

  const schedulePoll = (issueKey, delayMs = config.pollIntervalMs) => {
    if (pollHandles.has(issueKey)) {
      return;
    }

    const handle = setTimeout(async () => {
      pollHandles.delete(issueKey);

      try {
        await syncSession(issueKey);
      } catch (error) {
        log("error", "poll_failed", {
          issueKey,
          error: error.message,
        });

        const record = stateStore.getIssue(issueKey);

        if (record && ACTIVE_STATUSES.has(record.status)) {
          schedulePoll(issueKey, config.pollIntervalMs);
        }
      }
    }, delayMs);

    pollHandles.set(issueKey, handle);
  };

  const syncSession = async (issueKey) => {
    const record = stateStore.getIssue(issueKey);

    if (!record || !ACTIVE_STATUSES.has(record.status)) {
      cancelPoll(issueKey);
      return;
    }

    if (!record.devinId) {
      await stateStore.patchIssue(issueKey, {
        status: "failed",
        terminalReason: "missing_session_identifier",
        completedAt: new Date().toISOString(),
      });
      cancelPoll(issueKey);
      return;
    }

    if (!record.sessionCommentPostedAt) {
      try {
        await ensureComment({
          giteaClient,
          store: stateStore,
          issueKey,
          record: stateStore.getIssue(issueKey),
          marker: `<!-- devin-bridge:session:${record.sessionId} -->`,
          commentBody: buildSessionComment(record),
          successField: "sessionCommentPostedAt",
        });
      } catch (error) {
        log("error", "session_comment_failed", {
          issueKey,
          sessionId: record.sessionId,
          error: error.message,
        });
      }
    }

    const session = await devinClient.getSession(record.devinId);
    const prUrl = extractPrimaryPrUrl(session);

    await stateStore.patchIssue(issueKey, {
      sessionStatus: session.status,
      sessionStatusDetail: session.status_detail || null,
      lastPolledAt: new Date().toISOString(),
      sessionUrl: session.url || record.sessionUrl,
      prUrl: prUrl || record.prUrl || null,
    });

    const refreshedRecord = stateStore.getIssue(issueKey);

    if (prUrl && !refreshedRecord.prCommentPostedAt) {
      try {
        await ensureComment({
          giteaClient,
          store: stateStore,
          issueKey,
          record: {
            ...refreshedRecord,
            prUrl,
          },
          marker: `<!-- devin-bridge:pr:${refreshedRecord.sessionId} -->`,
          commentBody: buildPrComment({
            ...refreshedRecord,
            prUrl,
          }),
          successField: "prCommentPostedAt",
        });
      } catch (error) {
        log("error", "pr_comment_failed", {
          issueKey,
          sessionId: refreshedRecord.sessionId,
          prUrl,
          error: error.message,
        });
      }
    }

    const latestRecord = stateStore.getIssue(issueKey);
    const hasPendingComments =
      !latestRecord?.sessionCommentPostedAt || (Boolean(prUrl) && !latestRecord?.prCommentPostedAt);

    if (latestRecord?.prCommentPostedAt) {
      await stateStore.patchIssue(issueKey, {
        status: "completed",
        terminalReason: "pr_commented",
        completedAt: new Date().toISOString(),
      });
      cancelPoll(issueKey);
      return;
    }

    if (TERMINAL_SESSION_STATUSES.has(session.status)) {
      if (hasPendingComments) {
        schedulePoll(issueKey, config.pollIntervalMs);
        return;
      }

      await stateStore.patchIssue(issueKey, {
        status: session.status === "error" ? "failed" : "completed",
        terminalReason: session.status,
        completedAt: new Date().toISOString(),
      });
      cancelPoll(issueKey);
      return;
    }

    schedulePoll(issueKey, config.pollIntervalMs);
  };

  for (const [issueKey] of stateStore.listActiveIssues()) {
    schedulePoll(issueKey, 1000);
  }

  const server = http.createServer((request, response) => {
    void (async () => {
      const method = request.method || "GET";
      const requestUrl = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);

      if (method === "GET" && requestUrl.pathname === "/healthz") {
        sendJson(response, 200, {
          ok: true,
          activePolls: pollHandles.size,
          triggerLabel: config.triggerLabel,
        });
        return;
      }

      if (method === "POST" && requestUrl.pathname === "/webhooks/gitea") {
        const rawBody = await readRawBody(request);
        const deliveryId = request.headers["x-gitea-delivery"];
        const eventName = String(request.headers["x-gitea-event"] || "").toLowerCase();
        const eventType = String(request.headers["x-gitea-event-type"] || "").toLowerCase();
        const signature = request.headers["x-gitea-signature"];

        if (typeof signature !== "string") {
          sendJson(response, 401, { error: "missing_signature" });
          return;
        }

        const expectedSignature = getWebhookSignature(rawBody, config.gitea.webhookSecret);

        if (!signaturesMatch(signature, expectedSignature)) {
          log("error", "webhook_signature_mismatch", {
            deliveryId,
            eventName,
          });
          sendJson(response, 401, { error: "invalid_signature" });
          return;
        }

        let payload;

        try {
          payload = JSON.parse(rawBody.toString("utf8"));
        } catch {
          sendJson(response, 400, { error: "invalid_json" });
          return;
        }

        const triggerDecision = shouldTriggerSession({
          eventName,
          eventType,
          payload,
          triggerLabel: config.triggerLabel,
        });

        if (!triggerDecision.shouldTrigger) {
          log("info", "webhook_ignored", {
            deliveryId,
            eventName,
            eventType,
            reason: triggerDecision.reason,
          });
          await stateStore.rememberDelivery(deliveryId);
          sendJson(response, 202, {
            ignored: true,
            reason: triggerDecision.reason,
          });
          return;
        }

        const issue = buildIssueRecord(config, payload, String(deliveryId || ""));
        const issueKey = stateStore.getIssueKey(issue);
        const existingRecord = stateStore.getIssue(issueKey);

        if (stateStore.hasRecentDelivery(deliveryId)) {
          sendJson(response, 202, {
            ignored: true,
            reason: "duplicate_delivery",
            issueKey,
          });
          return;
        }

        if (existingRecord && ACTIVE_STATUSES.has(existingRecord.status)) {
          await stateStore.rememberDelivery(deliveryId);
          sendJson(response, 202, {
            ignored: true,
            reason: "active_session_exists",
            issueKey,
            sessionUrl: existingRecord.sessionUrl,
          });
          return;
        }

        await stateStore.upsertIssue(issueKey, {
          owner: issue.owner,
          repo: issue.repo,
          issueNumber: issue.issueNumber,
          issueTitle: issue.title,
          issueUrl: issue.url,
          labelName: config.triggerLabel,
          status: "starting",
          sessionId: null,
          devinId: null,
          sessionUrl: null,
          sessionStatus: null,
          sessionStatusDetail: null,
          sessionCommentPostedAt: null,
          prUrl: null,
          prCommentPostedAt: null,
          lastPolledAt: null,
          terminalReason: null,
          error: null,
          deliveryId: issue.deliveryId,
          createdAt: new Date().toISOString(),
        });
        await stateStore.rememberDelivery(deliveryId);

        log("info", "starting_devin_session", {
          issueKey,
          deliveryId,
        });

        try {
          const session = await devinClient.createSession({
            prompt: buildSessionPrompt({ issue }),
            title: `${issue.owner}/${issue.repo}#${issue.issueNumber}: ${issue.title}`,
            tags: buildSessionTags(issue),
            repos: config.devin.repos,
            playbookId: config.devin.playbookId,
            bypassApproval: config.devin.bypassApproval,
            maxAcuLimit: config.devin.maxAcuLimit,
          });

          await stateStore.patchIssue(issueKey, {
            status: "active",
            sessionId: session.session_id,
            devinId: session.devin_id,
            sessionUrl: session.url,
            sessionStatus: session.status,
            error: null,
          });

          schedulePoll(issueKey, 0);

          sendJson(response, 202, {
            accepted: true,
            issueKey,
            sessionId: session.session_id,
            sessionUrl: session.url,
          });
        } catch (error) {
          await stateStore.patchIssue(issueKey, {
            status: "failed",
            terminalReason: "session_creation_failed",
            completedAt: new Date().toISOString(),
            error: error.message,
          });

          log("error", "session_creation_failed", {
            issueKey,
            deliveryId,
            error: error.message,
          });

          sendJson(response, 502, {
            error: "session_creation_failed",
            issueKey,
          });
        }

        return;
      }

      sendJson(response, 404, { error: "not_found" });
    })().catch((error) => {
      log("error", "request_failed", {
        error: error.message,
      });
      sendJson(response, 500, { error: "internal_server_error" });
    });
  });

  server.listen(config.port, config.host, () => {
    log("info", "bridge_listening", {
      host: config.host,
      port: config.port,
      triggerLabel: config.triggerLabel,
      stateFile: config.stateFile,
    });
  });

  const shutdown = (signal) => {
    log("info", "shutdown_requested", { signal });

    for (const [issueKey] of pollHandles) {
      cancelPoll(issueKey);
    }

    server.close(() => {
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((error) => {
  log("error", "startup_failed", {
    error: error.message,
  });
  process.exit(1);
});
