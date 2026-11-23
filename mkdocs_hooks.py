"""MkDocs hook building the site pages from sections of `README.md` and `RECIPE.md`.

A page line `--8<-- "README.md:features"` is replaced by what that file holds between its `[start:features]` and `[end:features]` markers.
`README.md` folds each feature into `<details>`, points images at `docs/` and links its own anchors;
on the site a feature is a heading, `docs/` is the root, and the anchors live on other pages.
"""

import re
from pathlib import Path
from typing import Final

from mkdocs.config.defaults import MkDocsConfig
from mkdocs.structure.files import Files
from mkdocs.structure.pages import Page

__all__ = [
    "on_page_markdown",
]

_INCLUDE: Final[re.Pattern[str]] = re.compile(r'^--8<-- "(?P<path>[^:"]+):(?P<section>[^"]+)"$', re.MULTILINE)
_SUMMARY: Final[re.Pattern[str]] = re.compile(r"^<details>\n<summary><b>(?P<name>[^<]+)</b>: (?P<about>[^<]+)</summary>$", re.MULTILINE)
_DETAILS_END: Final[re.Pattern[str]] = re.compile(r"^</details>$", re.MULTILINE)
_IMAGE: Final[re.Pattern[str]] = re.compile(r'<img src="docs/(?P<src>[^"]+)"(?: width="(?P<width>\d+)")? alt="(?P<alt>[^"]+)">')
_FEATURE_POINTER: Final[re.Pattern[str]] = re.compile(r"See (?P<name>Folders|Spaces|Archive|Agents|Updates)\.")
_LINKS: Final[tuple[tuple[str, str], ...]] = (
    ("(#requirements)", "(install.md#requirements)"),
    ("(RECIPE.md)", "(recipe.md)"),
)


def _section(match: re.Match[str], /, *, root: Path) -> str:
    text = (root / match["path"]).read_text(encoding="utf-8")
    start = f"<!-- --8<-- [start:{match['section']}] -->\n"
    end = f"\n<!-- --8<-- [end:{match['section']}] -->"
    if start not in text or end not in text:
        message = f"{match['path']} has no section {match['section']}"
        raise ValueError(message)
    return text.split(start, 1)[1].split(end, 1)[0]


def _heading(match: re.Match[str]) -> str:
    about = match["about"]
    return f"## {match['name']}\n\n{about[0].upper()}{about[1:]}."


def _image(match: re.Match[str]) -> str:
    width = match["width"]
    size = f'{{ width="{width}" }}' if width else ""
    return f"![{match['alt']}]({match['src']}){size}"


def _feature_link(match: re.Match[str]) -> str:
    name = match["name"]
    return f"See [{name}](features.md#{name.lower()})."


def _outside_fences(markdown: str) -> str:
    """Demotes every top-level heading but the first, and doubles indents, outside top-level code fences.

    GitHub nests a list item indented by 2 spaces, Python-Markdown only from 4: https://python-markdown.github.io/#differences
    """
    lines = markdown.split("\n")
    fenced = False
    titled = False
    for index, line in enumerate(lines):
        if line.startswith("```"):
            fenced = not fenced
        if fenced:
            continue
        indent = len(line) - len(line.lstrip(" "))
        if indent:
            lines[index] = f"{' ' * indent}{line}"
        if line.startswith("# "):
            lines[index] = f"#{line}" if titled else line
            titled = True
    return "\n".join(lines)


def on_page_markdown(
    markdown: str,
    /,
    *,
    page: Page,
    config: MkDocsConfig,
    files: Files,
) -> str:
    """Expands one page's includes and rewrites their GitHub markup."""
    root = Path(config.config_file_path).parent
    markdown = _INCLUDE.sub(lambda match: _section(match, root=root), markdown)
    markdown = _SUMMARY.sub(_heading, markdown)
    markdown = _DETAILS_END.sub("", markdown)
    markdown = _IMAGE.sub(_image, markdown)
    markdown = _FEATURE_POINTER.sub(_feature_link, markdown)
    for old, new in _LINKS:
        markdown = markdown.replace(old, new)
    return _outside_fences(markdown)
