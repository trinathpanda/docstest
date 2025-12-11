# Boilerplate Documentation Template

This directory (`docs/docs/apps/boilerplate`) serves as a template for creating new application documentation pages that are consistent with the rest of the site.

## How to Create a New App Documentation Page

Follow these steps to add a new app:

### 1. Duplicate the Boilerplate

Copy this entire `boilerplate` folder and paste it into `docs/docs/apps/`. Rename the folder to your app's identifier (e.g., `my-new-app`).

### 2. Update `index.html`

Open `docs/docs/apps/my-new-app/index.html` and make the following changes:

- **Title**: Update the `<title>` tag in the `<head>` section.
- **Breadcrumbs**: Update the `<span>` text in the `.breadcrumbs` div (e.g., `<span>My New App</span>`).
- **Markdown Content**: The `<script id="markdown-content" type="text/markdown">` tag contains fallback content. You should generally update this or ensure your `content.md` is being loaded correctly by `script.js`.

### 3. Write Your Documentation

Open `docs/docs/apps/my-new-app/content.md` and write your documentation in Markdown format.

- Use H1 (`#`) for the main title.
- Use H2 (`##`) for main sections (these will appear in the Table of Contents).
- Use H3 (`###`) for subsections.

### 4. Add to Main Navigation (Optional)

If you want your app to be listed on the main documentation hub (`docs.zcash.me`):

1. Open `docs/docs/index.html`.
2. Find the `.app-grid` container.
3. Add a new `.app-card` block inside it, linking to your new app:

```html
<div class="app-card">
  <div class="app-icon">🚀</div> <!-- Choose an emoji or icon -->
  <h2 class="app-name">My New App</h2>
  <p class="app-desc">
    A brief description of my new app.
  </p>
  <a href="apps/my-new-app/index.html" class="app-link">View Documentation</a>
</div>
```

Until you do step 4, your new documentation page will exist but won't be linked from the home page (effectively "hidden" unless you share the direct link).
