import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const DEFAULT_STATE_FILE = path.join(REPO_ROOT, "bridge-runtime", "state.json");

function parseEnvFile(filePath) {
  const env = {};
  const content = readFileSync(filePath, "utf8");

  for (const rawLine of content.split(/\r?\n/u)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const normalized = line.startsWith("export ") ? line.slice(7) : line;
    const separatorIndex = normalized.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = normalized.slice(0, separatorIndex).trim();
    let value = normalized.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    env[key] = value;
  }

  return env;
}

function loadEnvFiles() {
  const envFiles = [".env", ".env.local"].map((name) => path.join(REPO_ROOT, name));

  for (const filePath of envFiles) {
    if (!existsSync(filePath)) {
      continue;
    }

    const fileValues = parseEnvFile(filePath);

    for (const [key, value] of Object.entries(fileValues)) {
      if (process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  }
}

function parseNumber(value, fallback) {
  if (value === undefined || value === "") {
    return fallback;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    throw new Error(`Expected a number but received "${value}"`);
  }

  return parsed;
}

function parseBoolean(value, fallback) {
  if (value === undefined || value === "") {
    return fallback;
  }

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  throw new Error(`Expected "true" or "false" but received "${value}"`);
}

function parseCsv(value) {
  return String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function requireValue(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable ${name}`);
  }

  return value;
}

export function loadConfig() {
  loadEnvFiles();

  const repos = parseCsv(requireValue("DEVIN_REPOS"));
  const stateFile = process.env.STATE_FILE
    ? path.resolve(REPO_ROOT, process.env.STATE_FILE)
    : DEFAULT_STATE_FILE;

  return {
    repoRoot: REPO_ROOT,
    host: process.env.HOST || "127.0.0.1",
    port: parseNumber(process.env.PORT, 3001),
    httpTimeoutMs: parseNumber(process.env.HTTP_TIMEOUT_MS, 10000),
    pollIntervalMs: parseNumber(process.env.POLL_INTERVAL_MS, 20000),
    triggerLabel: process.env.TRIGGER_LABEL || "devin-autostart",
    stateFile,
    maxRecentDeliveries: parseNumber(process.env.MAX_RECENT_DELIVERIES, 200),
    devin: {
      baseUrl: (process.env.DEVIN_API_BASE_URL || "https://api.devin.ai").replace(/\/$/u, ""),
      apiToken: requireValue("DEVIN_API_TOKEN"),
      orgId: requireValue("DEVIN_ORG_ID"),
      repos,
      playbookId: process.env.DEVIN_PLAYBOOK_ID || null,
      bypassApproval: parseBoolean(process.env.DEVIN_BYPASS_APPROVAL, false),
      maxAcuLimit:
        process.env.DEVIN_MAX_ACU_LIMIT === undefined || process.env.DEVIN_MAX_ACU_LIMIT === ""
          ? null
          : parseNumber(process.env.DEVIN_MAX_ACU_LIMIT, null),
    },
    gitea: {
      baseUrl: requireValue("GITEA_BASE_URL").replace(/\/$/u, ""),
      token: requireValue("GITEA_TOKEN"),
      webhookSecret: requireValue("GITEA_WEBHOOK_SECRET"),
    },
  };
}
