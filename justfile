set shell := ["bash", "-uc"]

herdr := env("XDG_CONFIG_HOME", env("HOME") / ".config") / "herdr-app"

[doc("Show the recipes")]
default:
    @just --list

[group("check")]
[doc("Load every mod once in a hidden window")]
lint:
    for mod in mods/*/; do herdr-app check "$mod"; done

[group("deploy")]
[doc("Copy the mods and the layout into the herdr-app home and merge the layout's keys")]
deploy: lint
    #!/usr/bin/env bash
    set -euo pipefail
    for mod in mods/*/; do
        mkdir -p "{{ herdr }}/$mod"
        cp "$mod"*.js "$mod"mod.json "{{ herdr }}/$mod"
    done
    cp layouts/*.json "{{ herdr }}/layouts/"
    keys="{{ herdr }}/keys.json"
    [ -f "$keys" ] || echo '{}' > "$keys"
    jq -s '.[0] * .[1]' "$keys" keys.json > "$keys.tmp"
    mv "$keys.tmp" "$keys"
