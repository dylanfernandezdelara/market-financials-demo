# Gitea to Devin Bridge

This repo includes a small local bridge service that accepts Gitea issue webhooks, starts a Devin session against the connected GitHub repository, and writes status back to the Gitea issue.

## What the bridge does

1. Accepts Gitea issue webhooks from a local repo.
2. Verifies the `X-Gitea-Signature` HMAC header.
3. Triggers only when the configured label is added to an issue.
4. Enforces one active Devin session per Gitea issue.
5. Starts a Devin session through the organization v3 API.
6. Posts the Devin session URL back to the Gitea issue.
7. Polls Devin until a pull request appears.
8. Posts the PR URL back to the same Gitea issue.

## Local bridge setup

Copy the committed example values and fill in the real secrets:

```bash
cp .env.example .env
```

Required values:

- `DEVIN_API_TOKEN`: service-user token with `ManageOrgSessions` and `ViewOrgSessions`
- `DEVIN_ORG_ID`: Devin organization id
- `DEVIN_REPOS`: exact repo identifier Devin expects in the `repos` array, typically `owner/repo-name`
- `GITEA_BASE_URL`: local Gitea base URL, for example `http://127.0.0.1:3000`
- `GITEA_TOKEN`: Gitea PAT used to list issue comments and create issue comments
- `GITEA_WEBHOOK_SECRET`: shared webhook secret configured in Gitea
- `TRIGGER_LABEL`: label name that should start the Devin session

Run the bridge:

```bash
npm run bridge:start
```

The bridge listens on `http://127.0.0.1:3001` by default and exposes:

- `GET /healthz`
- `POST /webhooks/gitea`

## Gitea configuration

For a local-only demo, Gitea must be allowed to call a loopback webhook target. In the Homebrew work path used on this machine, update:

- `/opt/homebrew/var/gitea/custom/conf/app.ini`

Add or update:

```ini
[webhook]
ALLOWED_HOST_LIST = loopback
```

Restart Gitea after editing `app.ini`.

Then, in the Gitea repo:

1. Create a PAT under `User Settings -> Applications`.
   The bridge needs enough permission to read issues/comments and write issue comments.
2. Add the label configured in `TRIGGER_LABEL`.
3. Create a webhook under `Settings -> Webhooks`.

Recommended webhook settings:

- Type: `Gitea`
- Target URL: `http://127.0.0.1:3001/webhooks/gitea`
- Method: `POST`
- Content Type: `application/json`
- Secret: same value as `GITEA_WEBHOOK_SECRET`
- Trigger on: `Issues`

Use Gitea's `Test Delivery` button after the bridge is running.

## Demo flow

1. Start Gitea locally.
2. Start the Next.js app if you want the UI available locally.
3. Start the bridge.
4. Create or open a Gitea issue in the local repo.
5. Add the configured trigger label to a Gitea issue.
6. The bridge posts a Devin session URL comment.
7. When Devin opens a PR, the bridge posts the PR URL comment.

## Runtime state

The bridge persists local state in:

- `bridge-runtime/state.json`

That file is ignored by git and lets the bridge resume active polling after a restart.
