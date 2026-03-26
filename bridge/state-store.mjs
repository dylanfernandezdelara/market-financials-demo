import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

const ACTIVE_STATUSES = new Set(["starting", "active"]);

function createDefaultState() {
  return {
    version: 1,
    recentDeliveries: [],
    issues: {},
  };
}

function nowIso() {
  return new Date().toISOString();
}

export class JsonStateStore {
  constructor(filePath, maxRecentDeliveries) {
    this.filePath = filePath;
    this.maxRecentDeliveries = maxRecentDeliveries;
    this.state = createDefaultState();
  }

  async init() {
    await mkdir(path.dirname(this.filePath), { recursive: true });

    try {
      const existing = await readFile(this.filePath, "utf8");
      const parsed = JSON.parse(existing);

      this.state = {
        ...createDefaultState(),
        ...parsed,
        recentDeliveries: Array.isArray(parsed.recentDeliveries) ? parsed.recentDeliveries : [],
        issues: parsed.issues && typeof parsed.issues === "object" ? parsed.issues : {},
      };
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw error;
      }

      await this.persist();
    }
  }

  getIssueKey({ owner, repo, issueNumber }) {
    return `${owner}/${repo}#${issueNumber}`;
  }

  getIssue(issueKey) {
    return this.state.issues[issueKey] ?? null;
  }

  listActiveIssues() {
    return Object.entries(this.state.issues).filter(([, issue]) =>
      ACTIVE_STATUSES.has(issue.status),
    );
  }

  hasRecentDelivery(deliveryId) {
    return Boolean(deliveryId) && this.state.recentDeliveries.includes(deliveryId);
  }

  async rememberDelivery(deliveryId) {
    if (!deliveryId || this.hasRecentDelivery(deliveryId)) {
      return;
    }

    this.state.recentDeliveries.unshift(deliveryId);
    this.state.recentDeliveries = this.state.recentDeliveries.slice(0, this.maxRecentDeliveries);
    await this.persist();
  }

  async upsertIssue(issueKey, nextIssue) {
    this.state.issues[issueKey] = {
      ...nextIssue,
      updatedAt: nowIso(),
    };

    await this.persist();
    return this.state.issues[issueKey];
  }

  async patchIssue(issueKey, updater) {
    const current = this.getIssue(issueKey);

    if (!current) {
      throw new Error(`Cannot patch missing issue state for ${issueKey}`);
    }

    const nextIssue =
      typeof updater === "function" ? updater(current) : { ...current, ...updater };

    return this.upsertIssue(issueKey, {
      ...current,
      ...nextIssue,
      createdAt: current.createdAt,
    });
  }

  async persist() {
    const tempPath = `${this.filePath}.tmp`;
    const content = `${JSON.stringify(this.state, null, 2)}\n`;

    await writeFile(tempPath, content, "utf8");
    await rename(tempPath, this.filePath);
  }
}
