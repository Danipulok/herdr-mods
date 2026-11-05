# herdr-mods

Mods and a layout for the Herdr desktop app (`herdr-app`).

- `mods/folders`: the spaces list with folders you make and name yourself, worktrees folded under their checkout, and the T3 look.
- `layouts/my-t3.json`: the `herdr-t3` layout with its spaces block pointed at `folders`.
- `keys.json`: the keys of the `layout:my-t3` section; `just deploy` merges them into the app's `keys.json`.

## Where the code comes from

| Part | Source | Commit |
|---|---|---|
| `mods/folders` base | [jankeesvw/herdr-space-folders](https://github.com/jankeesvw/herdr-space-folders) `mods/space-folders` | `d630695db04d852ec89d86dd284f603d133dbba5` |
| T3 changes in `mods/folders` | [JinJieBeWater/herdr-t3](https://github.com/JinJieBeWater/herdr-t3) `mods/t3-spaces` | `8b8506341a3aa285041f32e757bd48ef67c916bb` |
| `layouts/my-t3.json` | [JinJieBeWater/herdr-t3](https://github.com/JinJieBeWater/herdr-t3) `layouts/herdr-t3.json` | `8b8506341a3aa285041f32e757bd48ef67c916bb` |
| Both of the above | [herdrdev/herdr-app](https://github.com/herdrdev/herdr-app) `defaults/mods/spaces` and `defaults/layouts/main.json` | tag `v0.1.10` |

Herdr's code and `herdr-t3` are under the Apache License 2.0 (`licenses/Apache-2.0`); the folders code of `herdr-space-folders` is MIT (`licenses/space-folders-MIT`).

To bring in an upstream change, diff the upstream file from the commit in the table to its new head and apply the hunks, then update the table.

## Use

```sh
just deploy
herdr-app do layout.switch --name my-t3
```

The other `t3-*` mods (agents, inbox, tabs) come from `herdr-t3` itself and are installed as its README says.
