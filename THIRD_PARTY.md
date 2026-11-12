# Third-Party Code and Assets

## wc-markdown

- Version: vendored snapshot (repository export)
- License: MIT
- Source: <https://github.com/vanillawc/wc-markdown>
- Location: `components/vendor/wc-markdown.js`
- Notes: The bundle also contains marked and prism-es6. The header comments in the file identify those sections.

## marked

- License: MIT
- Source: <https://github.com/markedjs/marked>
- Notes: Bundled inside `components/vendor/wc-markdown.js`.

## Prism

- License: MIT
- Source: <https://prismjs.com>
- Notes: Bundled inside `components/vendor/wc-markdown.js`.

## Press Start 2P

- License: SIL Open Font License 1.1
- Source: <https://fonts.google.com/specimen/Press+Start+2P>
- Notes: Loaded from Google Fonts.

## IBM Plex Mono

- License: SIL Open Font License 1.1
- Source: <https://fonts.google.com/specimen/IBM+Plex+Mono>
- Notes: Loaded from Google Fonts.

## excalirender

- License: MIT
- Source: <https://github.com/qiaolei1973/excalirender>
- Notes: Development-only renderer used by `scripts/render-diagrams.mjs`. Not shipped to the browser.

## Google Tag Manager

- Service: Google Tag Manager
- Container: `GTM-MDJ26VZ`
- Notes: Loaded at runtime by `scripts/site.js`. Remove the ID from `scripts/site-config.js` to disable it.
