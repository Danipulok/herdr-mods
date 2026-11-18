// What toast-filter and agent-list share. A mod cannot import another mod's files, so this
//  file is copied into both, and `just lint` fails when the copies differ.

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
