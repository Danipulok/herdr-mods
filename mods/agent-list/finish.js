// Herdr rings the moment an agent finishes, while Claude Code often starts its next turn at once
//  or finishes with a shell, monitor or workflow still running. So toast-filter closes Herdr's
//  finish toast and lists it under `FINISHES`; this posts it again, marked `held`, if the agent
//  is still done `HOLD_MS` later with nothing running behind it. Herdr's own done sound is
//  silent.mp3 (the repo's settings.json), so this plays done.mp3 itself.

import { agents, hc, notify, playSound, settings, shared } from "herdr";
import { background, bottom, workflows } from "./footer.js";
import { FINISHES, record } from "./handoff.js";

const HOLD_MS = 3000;
const DONE_SOUND = "mods/agent-list/done.mp3";

export class FinishAlerts {
  // Finishes listed before this copy started were someone else's to ring.
  handled = new Set((shared(FINISHES) ?? []).map((finish) => finish.id));

  watch(cx) {
    for (const finish of shared(FINISHES) ?? []) {
      if (this.handled.has(finish.id)) continue;

      this.handled.add(finish.id);
      cx.spawn(async (cx) => {
        await cx.sleep(Math.max(0, finish.at + HOLD_MS - Date.now()));
        const reason = await this.dropReason(finish);
        record({ kind: "finish", overlay: finish.id, terminal: finish.note.action.args.terminal, title: finish.note.title, body: finish.note.body, verdict: reason ? "dropped" : "rung", reason });
        if (!reason) this.ring(finish.note);
      });
    }
  }

  // Why this finish stays silent, or null when it rings.
  async dropReason(finish) {
    const address = finish.note.action.args.terminal;
    const later = (shared(FINISHES) ?? []).some((other) => other.note.action.args.terminal === address && other.at > finish.at);
    if (later) return "a later finish";

    const status = agents().find((agent) => agent.address === address)?.status ?? "gone";
    if (status !== "done") return `agent ${status}`;

    const reply = await hc(["read", address]).catch(() => null);
    if (reply?.code !== 0) return null;

    const lines = bottom(reply.stdout);
    if (background(lines)) return "background";

    return workflows(lines).length > 0 ? "workflow" : null;
  }

  ring({ overlay, ...note }) {
    if (settings().sounds?.enabled !== false) playSound(DONE_SOUND);

    notify({ ...note, held: true });
  }
}
