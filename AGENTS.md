# Agent Implementation Guide

This document outlines the methodology for implementing interactive agents and components within the Learn to Auth application.

## Modal System

The application uses a centralized modal system for displaying dynamic content, primarily driven by markdown files.

### How Modals Work

1. **Trigger Elements**: Buttons with `data-try-me-out` attributes trigger modals
2. **Content Loading**: JavaScript loads markdown content from `/assets/markdown/{endpoint}.md`
3. **Rendering**: Content is rendered using the `wc-markdown` web component
4. **Display**: CSS controls modal visibility and positioning

### Implementation Steps

1. Create a button with `data-try-me-out="unique-identifier"`
2. Create a corresponding markdown file at `/assets/markdown/unique-identifier.md`
3. The modal system automatically handles loading and display

### Example Implementation

```html
<button class="try-me-btn" data-try-me-out="authorization-endpoint">
  Try Me Out: Authorization Endpoint
</button>
```

```markdown
# OIDC Authorization Endpoint

Content goes here...
```

### Best Practices

- Keep markdown content focused and concise
- Use proper code fencing for syntax highlighting
- Maintain consistency with existing markdown styling
- Test modal content across different screen sizes

## Web Components

The application leverages web components for consistent UI elements:

- `wc-markdown` for rendering markdown content
- Custom components like `site-header` and `site-footer`
```
This AGENTS.md file documents the methodology for implementing interactive features in the application, particularly focusing on the modal system that uses the wc-markdown component. It explains how the modals work, provides implementation steps, and includes best practices for maintaining consistency across the application.