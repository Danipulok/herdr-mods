// Herdr's toast, but Herdr's own `<agent> finished` is closed at once and handed to
//  `agent-list`, which posts it again, `held`, once the agent stayed done (finish.js).

import { View, div, image } from "gpui-kit";
import { v_flex, h_flex } from "gpui-base";
import { props, closeOverlay, run, theme, shared, setShared } from "herdr";

const DOT = { error: "blocked", warning: "working", success: "done", info: "accent" };
// Canonical: mods/agent-list/finish.js `FINISHES`, keep in sync (a mod cannot import another's files).
const FINISHES = "agents.finishes";
const KEPT_MS = 60000;

const fromHerdrFinish = (note) => !note.held && note.level === "info" && note.action?.name === "agent.focus" && / finished$/.test(note.title ?? "");

export default class Toast extends View {
  init() {
    const note = props() ?? {};
    if (!fromHerdrFinish(note)) return;

    closeOverlay(note.overlay);

    const now = Date.now();
    const recent = (shared(FINISHES) ?? []).filter((finish) => now - finish.at < KEPT_MS);
    setShared(FINISHES, [...recent, { id: note.overlay, at: now, note }]);
  }

  render(cx) {
    const t = theme();
    const p = props() ?? {};
    if (fromHerdrFinish(p)) return div();

    const login = /^([a-z0-9][a-z0-9_.-]{0,31}) needs login; run hc machine login \1$/.exec(p.body ?? "");
    const command = login ? `hc machine login ${login[1]}` : null;
    return h_flex()
      .id("toast")
      .size_full()
      .px(18)
      .gap(12)
      .items_center()
      .bg(t.popover)
      .cursor_pointer()
      .hover((s) => s.bg(t.hover))
      .on_click(() => {
        if (p.action?.name) run(p.action.name, p.action.args ?? {});
        closeOverlay(p.overlay);
      })
      .child(p.icon ? image(p.icon).w(18).h(18).flex_none() : div().size(8).rounded(4).flex_none().bg(t[DOT[p.level] ?? "accent"]))
      .child(
        v_flex()
          .flex_1()
          .overflow_hidden()
          .child(div().truncate().font_semibold().text_size(13).text_color(t.foreground).child(login ? `${login[1]} needs a login: run` : p.title ?? ""))
          .when(!login && Boolean(p.body), (el) => el.child(div().truncate().text_size(12).text_color(t.muted).child(p.body ?? "")))
          .when(Boolean(login), (el) => el.child(h_flex().gap(8).items_center()
            .child(div().flex_1().min_w(0).truncate().tooltip(command).text_size(12).text_color(t.muted).child(command))
            .child(div().id("toast-login-copy").flex_none().px(6).py(3).rounded(4).bg(t.raised)
              .text_size(12).text_color(t.foreground).cursor_pointer().hover(s => s.bg(t.hover))
              .on_click((_e, cx) => { cx.stop_propagation(); cx.write_to_clipboard(command); this.copied = true; cx.notify(); })
              .child(this.copied ? "Copied" : "Copy")))),
      );
  }
}
