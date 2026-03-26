function formatLabels(labels) {
  if (!labels.length) {
    return "none";
  }

  return labels.join(", ");
}

export function buildSessionPrompt({ issue }) {
  const issueBody = issue.body?.trim() || "No issue body provided.";

  return `You are working from a Gitea issue that should drive work in the connected GitHub repository attached to this Devin session.

Source ticket:
- Gitea repository: ${issue.owner}/${issue.repo}
- Issue: #${issue.issueNumber} - ${issue.title}
- Issue URL: ${issue.url}
- Labels: ${formatLabels(issue.labels)}

Instructions:
- Use the connected repository provided to this session as the source of truth for code changes.
- Implement the issue if code changes are required.
- Create a pull request if you make code changes.
- Mention the Gitea issue number in the PR description.
- Do not try to post back to Gitea directly; the bridge service handles issue comments.

Issue body:
${issueBody}`;
}
