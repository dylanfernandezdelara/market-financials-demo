export class GiteaClient {
  constructor({ baseUrl, token, timeoutMs }) {
    this.baseUrl = baseUrl;
    this.token = token;
    this.timeoutMs = timeoutMs;
  }

  async listIssueComments({ owner, repo, issueNumber }) {
    const endpoint = `/api/v1/repos/${encodeURIComponent(owner)}/${encodeURIComponent(
      repo,
    )}/issues/${issueNumber}/comments`;

    return this.request(endpoint, {
      method: "GET",
    });
  }

  async createIssueComment({ owner, repo, issueNumber, body }) {
    const endpoint = `/api/v1/repos/${encodeURIComponent(owner)}/${encodeURIComponent(
      repo,
    )}/issues/${issueNumber}/comments`;

    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify({ body }),
    });
  }

  async request(endpoint, init) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...init,
      headers: {
        Accept: "application/json",
        Authorization: `token ${this.token}`,
        "Content-Type": "application/json",
        ...init.headers,
      },
      signal: AbortSignal.timeout(this.timeoutMs),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gitea API ${response.status}: ${errorText}`);
    }

    return response.json();
  }
}
