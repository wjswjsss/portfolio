# Portfolio

A clean, single-page personal portfolio for job applications. Built with **plain HTML, CSS, and JavaScript** — no framework, no build step, no dependencies.

## Features

- Section-based navigation — only the selected section is shown (Home, Publications, Experience, Projects).
- Project **tags** with **multi-select filtering** (a project matches when it has *all* selected tags).
- Responsive layout with a mobile menu.
- Project cards support GIFs / images (robotic-arm demos, architecture diagrams, etc.).
- Fully in English.

## Run locally

Just open `index.html` in a browser. For a local server (recommended so paths resolve cleanly):

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Edit your content

All content lives in [`js/data.js`](js/data.js):

- `PUBLICATIONS` — papers (authors containing "Jiashu" are auto-highlighted).
- `EXPERIENCE` — roles shown as a timeline.
- `PROJECTS` — title, description, `media` path, `tags`, and links.

Add media to `assets/` (see [`assets/README.md`](assets/README.md)). Put your CV at `assets/cv.pdf`.

Update the name, links, and email in `index.html` (the Home hero section).

## Structure

```
index.html        # markup + section layout
css/styles.css    # styling
js/data.js        # YOUR content (edit this)
js/main.js        # navigation + tag filtering logic
assets/           # cv.pdf and project media
```

## Deploy

Works on any static host (GitHub Pages, Netlify, Vercel). For GitHub Pages: push to a repo and enable Pages on the default branch.