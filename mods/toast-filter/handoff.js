// What toast-filter, agent-list and folders share. A mod cannot import another mod's files, so this
//  file is copied into each, and `just lint` fails when the copies differ.

import { checking, exec } from "herdr";

// Herdr's finish toasts, closed by toast-filter and rung again by agent-list once the agent stayed done.
export const FINISHES = "agents.finishes";

const APPEND = 'dir="${XDG_STATE_HOME:-$HOME/.local/state}/herdr-mods" && mkdir -p "$dir" && printf "%s\\n" "$1" >> "$dir/notifications.jsonl"';

const pad = (number) => String(number).padStart(2, "0");

const localTime = (date) => {
  const offset = -date.getTimezoneOffset();
  const zone = `${offset < 0 ? "-" : "+"}${pad(Math.floor(Math.abs(offset) / 60))}:${pad(Math.abs(offset) % 60)}`;
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}${zone}`;
};

// Appends one JSON line per event, so a popup gone in a second can still be read afterwards.
export const record = (entry) => {
  if (checking()) return;

  exec("sh", ["-c", APPEND, "sh", JSON.stringify({ at: localTime(new Date()), ...entry })]);
};

const REPEAT_MS = 2000;

let lastFailure = { message: null, at: 0 };

// A throwing render shows gpui-shell's error banner over the last good frame until the next render
//  passes, and the shell logs it nowhere (`self.error` only), so the failure is recorded here.
//  https://github.com/herdrdev/herdr-app/blob/034f8b85f7e6bb71f8ff55cb4a80c548b2578c0f/vendor/gpui-kit/crates/shell/src/view.rs#L263
export const recordFailures = (mod, render) => {
  try {
    return render();
  } catch (error) {
    const message = String(error), now = Date.now();
    if (message !== lastFailure.message || now - lastFailure.at > REPEAT_MS) record({ kind: "render-error", mod, message, stack: error?.stack ?? null });

    lastFailure = { message, at: now };
    throw error;
  }
};
