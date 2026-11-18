set shell := ["bash", "-uc"]

herdr := env("XDG_CONFIG_HOME", env("HOME") / ".config") / "herdr-app"
# A layout names its toast mod only from this Herdr on; before it a silent done sound would mute every finish.
held_alerts_from := "0.1.16"

[doc("Show the recipes")]
default:
    @just --list

[group("check")]
[doc("Load every mod once in a hidden window, and check the file two mods share is the same in both")]
lint:
    for mod in mods/*/; do herdr-app check "$mod"; done
    cmp mods/toast-filter/handoff.js mods/agent-list/handoff.js

[group("deploy")]
[doc("Copy the mods and the layout into the herdr-app home, merge the layout's keys and, on a Herdr that holds finish alerts, the sound settings")]
deploy: lint
    #!/usr/bin/env bash
    set -euo pipefail
    for mod in mods/*/; do
        mkdir -p "{{ herdr }}/$mod"
        cp "$mod"*.js "$mod"mod.json "{{ herdr }}/$mod"
        find "$mod" -maxdepth 1 \( -name "*.svg" -o -name "*.mp3" \) -exec cp {} "{{ herdr }}/$mod" \;
    done
    cp layouts/*.json "{{ herdr }}/layouts/"
    merge() {
        local target="{{ herdr }}/$1"
        [ -f "$target" ] || echo '{}' > "$target"
        jq -s '.[0] * .[1]' "$target" "$1" > "$target.tmp"
        mv "$target.tmp" "$target"
    }
    merge keys.json
    version=$(herdr-app --version | awk '{ print $2 }')
    if [ "$(printf '%s\n' {{ held_alerts_from }} "$version" | sort -V | head -1)" != {{ held_alerts_from }} ]; then
        echo "herdr-app $version: settings.json not merged, finish alerts stay immediate until Herdr {{ held_alerts_from }}" >&2
        exit 0
    fi
    current=$(jq -r '.sounds.done // ""' "{{ herdr }}/settings.json" 2>/dev/null || true)
    ours=$(jq -r '.sounds.done' settings.json)
    if [ -n "$current" ] && [ "$current" != "$ours" ]; then
        echo "settings.json not merged: sounds.done is your own $current; clear it in Settings > Alerts to get held finish alerts" >&2
        exit 0
    fi
    merge settings.json
