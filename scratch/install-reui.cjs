"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

var import_node_fs = __toESM(require("node:fs"));
var import_node_os = __toESM(require("node:os"));
var import_node_path = __toESM(require("node:path"));
var MCP_ORIGIN = (process.env.REUI_MCP_ORIGIN || "https://mcp.reui.io").replace(/\/+$/, "");
var MCP_URL = `${MCP_ORIGIN}/api/mcp`;
var WEB_ORIGIN = (process.env.REUI_WEB_ORIGIN || "https://reui.io").replace(
  /\/+$/,
  ""
);
var PROJECT = import_node_path.default.resolve(process.env.REUI_DIR || process.cwd());
var GLOBAL = /^(1|true|yes|on)$/i.test(process.env.REUI_GLOBAL || "");
var KEY = (process.env.REUI_LICENSE_KEY || "").trim() || null;
var home = import_node_os.default.homedir();
var log = (...a) => console.log(...a);
var written = [];
function writeEnsured(file, content) {
  import_node_fs.default.mkdirSync(import_node_path.default.dirname(file), { recursive: true });
  import_node_fs.default.writeFileSync(file, content);
}
function mergeJson(file, mutate) {
  let obj = {};
  try {
    obj = JSON.parse(import_node_fs.default.readFileSync(file, "utf8"));
  } catch {
  }
  mutate(obj);
  writeEnsured(file, `${JSON.stringify(obj, null, 2)}\n`);
  written.push(file);
}
function upsertMarked(file, body, startMark, endMark) {
  const block = `${startMark}\n${body}\n${endMark}`;
  let text = "";
  try {
    text = import_node_fs.default.readFileSync(file, "utf8");
  } catch {
  }
  const s = text.indexOf(startMark);
  const e = text.indexOf(endMark);
  text = s !== -1 && e !== -1 && e > s ? text.slice(0, s) + block + text.slice(e + endMark.length) : `${text ? `${text.replace(/\s+$/, "")}\n\n` : ""}${block}\n`;
  writeEnsured(file, text);
  written.push(file);
}
function ensureGitignored(entry) {
  if (GLOBAL) return;
  const gi = import_node_path.default.join(PROJECT, ".gitignore");
  let c = "";
  try {
    c = import_node_fs.default.readFileSync(gi, "utf8");
  } catch {
  }
  if (c.split(/\r?\n/).some((l) => l.trim() === entry)) return;
  writeEnsured(gi, `${c}${c && !c.endsWith("\n") ? "\n" : ""}${entry}\n`);
}
async function main() {
  log(`Installing the ReUI agent skill from ${MCP_ORIGIN} ...`);
  let bundle;
  try {
    const res = await fetch(`${MCP_ORIGIN}/api/skills/download`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    bundle = await res.json();
  } catch (e) {
    console.error(
      `Could not fetch the skill from ${MCP_ORIGIN}: ${e.message}`
    );
    process.exit(1);
    return;
  }
  const fileOf = (name) => bundle.files.find((f) => f.path === name)?.content ?? "";
  const installSkillDir = (dir) => {
    import_node_fs.default.rmSync(dir, { recursive: true, force: true });
    const resolvedDir = import_node_path.default.resolve(dir);
    for (const f of bundle.files) {
      const target = import_node_path.default.resolve(import_node_path.default.join(resolvedDir, f.path));
      if (!target.startsWith(resolvedDir)) {
        throw new Error(`Security Exception: Unsafe file path inside bundle: ${f.path}`);
      }
      writeEnsured(target, f.content);
    }
    return dir;
  };
  const claudeAuth = KEY ? { Authorization: 'Bearer ${REUI_LICENSE_KEY}' } : void 0;
  const cursorAuth = KEY ? { Authorization: 'Bearer ${env:REUI_LICENSE_KEY}' } : void 0;
  const opencodeAuth = KEY ? { Authorization: 'Bearer {env:REUI_LICENSE_KEY}' } : void 0;
  const httpEntry = (auth) => ({
    type: "http",
    url: MCP_URL,
    ...auth ? { headers: auth } : {}
  });
  log(
    `Skill v${bundle.version} (${bundle.files.length} files). ${KEY ? "License wired for headless use (plan-aware)." : "Sign in with ReUI on first use (free account)."}`
  );
  const claudeDir = GLOBAL ? import_node_path.default.join(home, ".claude", "skills", "reui") : import_node_path.default.join(PROJECT, ".claude", "skills", "reui");
  written.push(installSkillDir(claudeDir));
  written.push(
    installSkillDir(
      GLOBAL ? import_node_path.default.join(home, ".agents", "skills", "reui") : import_node_path.default.join(PROJECT, ".agents", "skills", "reui")
    )
  );
  mergeJson(
    GLOBAL ? import_node_path.default.join(home, ".claude.json") : import_node_path.default.join(PROJECT, ".mcp.json"),
    (o) => {
      const servers = o.mcpServers ??= {};
      servers.reui = httpEntry(claudeAuth);
    }
  );
  if (KEY) {
    mergeJson(
      GLOBAL ? import_node_path.default.join(home, ".claude", "settings.json") : import_node_path.default.join(PROJECT, ".claude", "settings.local.json"),
      (o) => {
        const env = o.env ??= {};
        env.REUI_LICENSE_KEY = KEY;
      }
    );
    ensureGitignored(".claude/settings.local.json");
  }
  upsertMarked(
    import_node_path.default.join(home, ".codex", "config.toml"),
    `[mcp_servers.reui]\nurl = "${MCP_URL}"${KEY ? `\nbearer_token_env_var = "REUI_LICENSE_KEY"` : ""}`,
    "# reui:start",
    "# reui:end"
  );
  if (!GLOBAL) {
    installSkillDir(import_node_path.default.join(PROJECT, ".cursor", "skills", "reui"));
    writeEnsured(
      import_node_path.default.join(PROJECT, ".cursor", "rules", "reui.mdc"),
      `---\ndescription: Use the ReUI registry (blocks, primitives, icons) correctly\nglobs: ["**/*.tsx","**/*.ts"]\nalwaysApply: false\n---\n\n${fileOf("SKILL.md")}`
    );
    mergeJson(import_node_path.default.join(PROJECT, ".cursor", "mcp.json"), (o) => {
      const servers = o.mcpServers ??= {};
      servers.reui = {
        url: MCP_URL,
        ...cursorAuth ? { headers: cursorAuth } : {}
      };
    });
    installSkillDir(import_node_path.default.join(PROJECT, ".opencode", "skills", "reui"));
    mergeJson(import_node_path.default.join(PROJECT, "opencode.json"), (o) => {
      o.$schema ??= "https://opencode.ai/config.json";
      const mcp = o.mcp ??= {};
      mcp.reui = {
        type: "remote",
        url: MCP_URL,
        enabled: true,
        ...opencodeAuth ? { headers: opencodeAuth } : {}
      };
    });
  }
  log("\nInstalled ReUI for Agents (skill + MCP) into:");
  for (const w of Array.from(new Set(written)))
    log(`  - ${import_node_path.default.relative(PROJECT, w)}`);
}
main().catch((e) => {
  console.error(`Install failed: ${e.message}`);
  process.exit(1);
});
