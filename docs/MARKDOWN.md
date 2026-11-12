# Markdown

Page content lives in `content/` as Markdown. Pages render it with the `lazy-wc-markdown` component.

## Inline Content

```html
<lazy-wc-markdown>
## Heading

Some **markdown**.
</lazy-wc-markdown>
```

## External Content (Preferred)

```html
<lazy-wc-markdown src="../content/concepts/jwks.md"></lazy-wc-markdown>
```

The `src` path is resolved relative to the page, not the Markdown file.

## What the Renderer Does

1. Fetches the file when `src` is present.
2. Dedents the content.
3. Renders it with `marked`.
4. Applies Prism syntax highlighting.
5. Inserts the HTML into light DOM and sets `rendered` for the fade-in.

Raw HTML is allowed inside Markdown. Use it sparingly, for things Markdown cannot express.

## Supported Syntax

- Headings, lists, tables, blockquotes, and horizontal rules
- Fenced code blocks with language hints such as `http`, `json`, `js`, and `text`
- Inline code, links, emphasis, and strikethrough
- Raw HTML blocks and inline HTML

## Images and Diagrams

Images are also resolved relative to the page that displays the Markdown.

```md
![OAuth 2.0 Authorization Code flow](assets/diagrams/oauth2-authorization-code.svg)
```

From a concept page, prefix the path with `../`. The SVG files are rendered from the editable `.excalidraw` scenes in `diagrams/`. Run `make diagrams` after changing a scene.

## Link Rules

Links are resolved relative to the page that displays the Markdown.

- From a root page: `concepts/jwks.html`
- From a concept page: `../oidc.html` or `jwks.html`
- External links: use the full `https://` URL

Run `make check-links` after adding links or images.

## Formatting

Biome formats Markdown as part of `make format`. Keep one sentence per line only if it helps review; the formatter will wrap paragraphs.

Avoid decorative em dashes. Use hyphens or restructure the sentence.
