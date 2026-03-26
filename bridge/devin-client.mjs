function buildDevinId(sessionId) {
  return sessionId.startsWith("devin-") ? sessionId : `devin-${sessionId}`;
}

export class DevinClient {
  constructor({ baseUrl, orgId, token, timeoutMs }) {
    this.baseUrl = baseUrl;
    this.orgId = orgId;
    this.token = token;
    this.timeoutMs = timeoutMs;
  }

  async createSession({ prompt, title, tags, repos, playbookId, bypassApproval, maxAcuLimit }) {
    const body = {
      prompt,
      repos,
      tags,
      title,
    };

    if (playbookId) {
      body.playbook_id = playbookId;
    }

    if (typeof bypassApproval === "boolean") {
      body.bypass_approval = bypassApproval;
    }

    if (typeof maxAcuLimit === "number") {
      body.max_acu_limit = maxAcuLimit;
    }

    const response = await this.request(
      `/v3/organizations/${encodeURIComponent(this.orgId)}/sessions`,
      {
        method: "POST",
        body: JSON.stringify(body),
      },
    );

    return {
      ...response,
      devin_id: buildDevinId(response.session_id),
    };
  }

  async getSession(devinId) {
    return this.request(
      `/v3/organizations/${encodeURIComponent(this.orgId)}/sessions/${encodeURIComponent(devinId)}`,
      {
        method: "GET",
      },
    );
  }

  async request(endpoint, init) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...init,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
        ...init.headers,
      },
      signal: AbortSignal.timeout(this.timeoutMs),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Devin API ${response.status}: ${errorText}`);
    }

    return response.json();
  }
}
