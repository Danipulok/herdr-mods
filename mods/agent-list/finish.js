// Herdr rings the moment an agent finishes, while Claude Code often starts its next turn at once
//  or finishes with a shell, monitor or workflow still running. So toast-filter closes Herdr's
//  finish toast and lists it under `FINISHES`; this posts it again, marked `held`, if the agent
//  is still done `HOLD_MS` later with nothing running behind it. Herdr's own done sound is
//  silent.mp3 (the repo's settings.json), so this plays done.mp3 itself.

import { agents, hc, notify, playSound, settings, shared } from "herdr";
import { background, bottom, workflows } from "./footer.js";
import { FINISHES } from "./handoff.js";

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
        if (await this.stillDone(finish)) this.ring(finish.note);
      });
    }
  }

  async stillDone(finish) {
    const address = finish.note.action.args.terminal;
    const later = (shared(FINISHES) ?? []).some((other) => other.note.action.args.terminal === address && other.at > finish.at);
    if (later || agents().find((agent) => agent.address === address)?.status !== "done") return false;

    const reply = await hc(["read", address]).catch(() => null);
    if (reply?.code !== 0) return true;

    const lines = bottom(reply.stdout);
    return !background(lines) && workflows(lines).length === 0;
  }

  ring({ overlay, ...note }) {
    if (settings().sounds?.enabled !== false) playSound(DONE_SOUND);

    notify({ ...note, held: true });
  }
}
