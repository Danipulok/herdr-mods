// Looks for a newer herdr-mods release than the one installed, at most every six hours,
//  and posts a toast once a day while there is one; its click opens the update dialog.

import { checking, exec, notify, setShared, shared } from "herdr";
import { record } from "./handoff.js";
import { VERSION } from "./version.js";

export const REPO = "https://github.com/Danipulok/herdr-mods";
export const UPDATE = "folders.update";
const LATEST = "https://api.github.com/repos/Danipulok/herdr-mods/releases/latest";
const CHECK_MS = 6 * 60 * 60 * 1000;
const NOTIFY_MS = 24 * 60 * 60 * 1000;
// Shared, not `localStorage`, which Herdr keeps per mod copy: the dialog stops and installs, the sidebar checks.
const STATE = "folders.update.state";

const parts = (version) => version.split(".").map(Number);

function newer(latest, installed) {
  const latestParts = parts(latest), installedParts = parts(installed);
  const index = latestParts.findIndex((part, at) => part !== installedParts[at]);
  return index >= 0 && latestParts[index] > (installedParts[index] ?? 0);
}

const memo = () => shared(STATE) ?? {};
const remember = (patch) => setShared(STATE, { ...memo(), ...patch });
const since = (key) => Date.now() - (memo()[key] ?? 0);

export const stopChecking = () => remember({ off: true });

// `herdr-app do folders.check-updates`: on again, and a check right now.
export const startChecking = () => remember({ off: false, checked: 0, notified: 0 });

export async function checkUpdate() {
  if (checking() || memo().off || since("checked") < CHECK_MS) return;

  remember({ checked: Date.now() });
  // Herdr's `fetch` sends no `User-Agent`, which GitHub answers with 403.
  //  https://docs.github.com/en/rest/using-the-rest-api/troubleshooting-the-rest-api#user-agent-required
  const headers = { Accept: "application/vnd.github+json", "User-Agent": "herdr-mods" };
  const response = await fetch(LATEST, { headers }).catch((error) => ({ ok: false, status: String(error) }));
  const release = response.ok ? await response.json().catch(() => null) : null;
  const latest = release?.tag_name?.replace(/^v/, "") ?? null;

  record({ kind: "update-check", installed: VERSION, latest, status: response.status });
  if (!latest) return;

  if (!newer(latest, VERSION)) {
    setShared(UPDATE, null);
    return;
  }

  setShared(UPDATE, { latest, url: release.html_url ?? REPO });
  if (since("notified") < NOTIFY_MS) return;

  remember({ notified: Date.now() });
  notify({ title: `herdr-mods ${latest} is out`, body: `This is ${VERSION}. Click to update.`, level: "info", action: { name: "folders.update" } });
}

export const updatePrompt = ({ latest, url }) =>
  `Read ${REPO} and update my installed herdr-mods from ${VERSION} to ${latest}, as its README installs it. What changed: ${url}`;

// The release's own install: its tarball unpacked into the cache, then its `just deploy`, as the README installs a clone.
const INSTALL = `set -eu
dir="\${XDG_CACHE_HOME:-$HOME/.cache}/herdr-mods/$1"
rm -rf "$dir"
mkdir -p "$dir"
curl -fsSL "https://codeload.github.com/Danipulok/herdr-mods/tar.gz/refs/tags/v$1" | tar -xz -C "$dir" --strip-components=1
cd "$dir"
just deploy`;

// Resolves with the output of a failed install; a finished one replaces this mod, whose next copy says so (`announceInstalled`).
export async function install(latest) {
  remember({ installing: latest });
  const result = await exec("sh", ["-c", INSTALL, "sh", latest]).catch((error) => ({ code: -1, stdout: "", stderr: String(error) }));
  if (result.code === 0) return null;

  remember({ installing: null });
  record({ kind: "update-install", latest, code: result.code, stderr: result.stderr });
  return `${result.stdout}${result.stderr}`.trim().split("\n").slice(-6).join("\n") || `the install exited with ${result.code}`;
}

export function announceInstalled() {
  if (checking() || memo().installing !== VERSION) return;

  remember({ installing: null, checked: 0 });
  setShared(UPDATE, null);
  record({ kind: "update-install", latest: VERSION, code: 0 });
  notify({ title: `herdr-mods ${VERSION} installed`, level: "success" });
}
