# Concepts

Concepts are short reference pages that do not belong to one of the primary authentication categories. They live at `/concepts/<concept-name>`.

## Adding A Concept

1. Create `content/concepts/<concept-name>.md`.
2. Copy an existing shell from `concepts/` to `concepts/<concept-name>.html`.
3. Update the title, description, and `src` path.
4. Add the concept to `content/concepts/index.md`.
5. Add the page to the `PRECACHE` list in `sw.js` and to `sitemap.xml`.
6. Run `make check-all`.

Concept page shells use `data-root="../"` so shared assets resolve correctly from the `concepts/` directory.

## Writing Guidance

- Start with a one-paragraph definition.
- Use concrete examples and short code blocks.
- End with common mistakes or a checklist when it helps.
- Keep claims verifiable. Link to the specification or a primary source when a detail is easy to misremember.
- Prefer hyphens and plain punctuation over decorative dashes.

## Current Concepts

- Authentication vs. Authorization
- Strong Customer Authentication (SCA)
- Password matching with bcrypt and salts
- Glossary of terms
- Standard claims reference
- OpenID Connect Discovery Document
- JWKS endpoint
- ID Token vs. Access Token
