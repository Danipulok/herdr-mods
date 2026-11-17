// Claude Code's lines under its last rule: the footer, as in `⏵⏵ auto mode on · 1 shell · ↓ to manage`,
//  then one line per running workflow, as in `◯ harness-review-round  ░░░░  0/8 · 8m29s · ↓ 1.4m tokens`.
export function bottom(screen) {
  const lines = screen.trimEnd().split("\n").map((line) => line.trim());
  let rule = lines.length - 1;
  while (rule >= 0 && !/^─+$/.test(lines[rule])) rule -= 1;
  return lines.slice(rule + 1).filter(Boolean);
}

// What still runs behind an agent that reads as idle: the footer counts it.
export function background(lines) {
  return lines.flatMap((line) => line.split(/ · |, /)).map((part) => part.trim()).filter((part) => /^\d+ [a-z][a-z ]*$/.test(part)).join(", ");
}

// Each running workflow's name and the steps done, `["harness-review-round", "0/8"]`.
export function workflows(lines) {
  return lines.map((line) => /^\S\s+(\S+)\s+[░▒▓█]+\s+(\d+\/\d+)/.exec(line)).filter(Boolean).map(([, name, done]) => [name, done]);
}
