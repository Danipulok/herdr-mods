# Changelog

## [1.2.0](https://github.com/Danipulok/herdr-mods/compare/v1.1.0...v1.2.0) (2026-11-10)


### Features

* **agent-list:** put done agents with a running shell, monitor or workflow straight into `Background` ([581bf70](https://github.com/Danipulok/herdr-mods/commit/581bf70f729199f31a1bef5faa6d0ed23a13778c))

## [1.1.0](https://github.com/Danipulok/herdr-mods/compare/v1.0.0...v1.1.0) (2026-11-10)


### Features

* **agent-list:** put idle agents with a running shell, monitor or workflow in a `Background` section above `Idle` ([0a5f1e4](https://github.com/Danipulok/herdr-mods/commit/0a5f1e42c2bb72b542dcaa2905c5e2263841be15))

## 1.0.0 (2026-11-10)


### Features

* **agent-list:** show each running Claude Code workflow and its steps done beside the agent ([fa183bf](https://github.com/Danipulok/herdr-mods/commit/fa183bffb9016b413449aa81ac3ed347004b7d6e))
* **agent-list:** show the shells and monitors an idle Claude Code agent still runs ([7196a9a](https://github.com/Danipulok/herdr-mods/commit/7196a9a18f311f9506c4f18dd1454e88c2c69d70))
* **folders:** add the folders mod, a copy of `space-folders` `d630695` with its overlays renamed ([f9f9868](https://github.com/Danipulok/herdr-mods/commit/f9f9868c020e9949988a26d7d643483176fc4433))
* **folders:** archive a space into its folder and restore it with its Claude session resumed ([feefb48](https://github.com/Danipulok/herdr-mods/commit/feefb48c58d1e6e0c843d6decc606af49ede768b))
* **folders:** bring the `herdr-t3` spaces look and worktree folding into the folders mod ([2bada62](https://github.com/Danipulok/herdr-mods/commit/2bada625ded3dfb8e5337bac2dbab3eca33082db))
* **folders:** colour the archived space Delete item red ([6facbdb](https://github.com/Danipulok/herdr-mods/commit/6facbdb11031614f38317006804f3543dc1ffc65))
* **folders:** edit a space's name and folder in one dialog, in place of the picker-only menu item ([9752c01](https://github.com/Danipulok/herdr-mods/commit/9752c01180c13d838f6af1f5b8878e88d863c065))
* **folders:** fill the space folder from its last Claude Code session ([7a6acdb](https://github.com/Danipulok/herdr-mods/commit/7a6acdb36ca24b62518edffa0084178129e3206f))
* **folders:** give the archived space menu items their icons ([46b54cd](https://github.com/Danipulok/herdr-mods/commit/46b54cdd5fccb2958edd63ef2bf41ddc197f7d0c))
* **folders:** label agent terminals with their space's folder for the Telegram topic name ([6addf48](https://github.com/Danipulok/herdr-mods/commit/6addf486f16bd2caf2e52cf8613dd28c3f10cc51))
* **folders:** open a space menu of its own on right-click with colour, git pull, archive and a red close ([22a6509](https://github.com/Danipulok/herdr-mods/commit/22a6509ab89f71c0142be2dc247d8764feb5f129))
* **folders:** pick a space colour from its badge, kept in the folders file ([fab51e6](https://github.com/Danipulok/herdr-mods/commit/fab51e64ac2c890dd208a4b9f33f8535786f2388))
* **folders:** pin a space's folder from its menu, and keep a subfolder when the live folder drops back ([61d5d5c](https://github.com/Danipulok/herdr-mods/commit/61d5d5c9a4fff6a1295772b486e411b9718d9507))
* **folders:** record each archived tab's terminal so ccgram can keep its topic ([6d95261](https://github.com/Danipulok/herdr-mods/commit/6d95261a9d60e3e533487d21bd43ce9e1f748877))
* **folders:** refuse a start folder that is not there, and walk hints and fields with the keyboard ([6252526](https://github.com/Danipulok/herdr-mods/commit/6252526701a33193414b448c07302d84ea87ea72))
* **folders:** restore an archived space from its hover button and delete it only from the right-click menu ([77c6b68](https://github.com/Danipulok/herdr-mods/commit/77c6b686b3f68ee61b108d6cac4e7d534ebd84f7))
* **folders:** suggest folders and paths while typing the collect rules ([0610dcf](https://github.com/Danipulok/herdr-mods/commit/0610dcf75d18942b6d6ea236c00d5e936d58ce8d))
* **keys:** archive the space in front with `cmd-shift-w` ([3641975](https://github.com/Danipulok/herdr-mods/commit/3641975986393c4633ce49f3f36e4b69456ebaf2))
* **keys:** archive the space in front with `ctrl-shift-w` too, in place of closing the tab ([0f21878](https://github.com/Danipulok/herdr-mods/commit/0f218787b467fcb06307ef82fb7a8ca00b832420))
* **keys:** open a new tab with `ctrl-shift-t`, as in Ghostty ([13bba1f](https://github.com/Danipulok/herdr-mods/commit/13bba1f20a2fe5b40e2d7fbf24e6f92ede895558))
* **keys:** paste clipboard text with `ctrl-v`, leaving an image to the program as before ([d90336f](https://github.com/Danipulok/herdr-mods/commit/d90336f75cbe52f17742e66d460455aef8b64d54))
* **layouts:** add the `my-t3` layout, its keys and a deploy recipe ([6de608f](https://github.com/Danipulok/herdr-mods/commit/6de608faf98c21a173a49cd31f2560e375e5d289))


### Bug Fixes

* **folders:** apply a save once, so folding a folder and every other change stick again ([47a3a69](https://github.com/Danipulok/herdr-mods/commit/47a3a69c23f98390428a140407582117b865f30c))
* **folders:** archive and restore from the right-click menus, and fold the archive a space is restored from ([42e7b0c](https://github.com/Danipulok/herdr-mods/commit/42e7b0c0933706a4486fb8878f74f5ac17cef064))
* **folders:** centre the letter on a space avatar ([134f4f7](https://github.com/Danipulok/herdr-mods/commit/134f4f733e534ad619bcd9ae6dd2d2d9a31e6b74))
* **folders:** drop the hover buttons on right-click, and draw the space color swatches round like the folder ones ([56c0f8f](https://github.com/Danipulok/herdr-mods/commit/56c0f8fc6bf75bff6def2e11b4591beb49576ce5))
* **folders:** write a save onto the newer of the file and the copy in memory, and read the file as soon as it changes ([d094434](https://github.com/Danipulok/herdr-mods/commit/d0944344c4cf5978d4253b2ad0319e6072665eec))
