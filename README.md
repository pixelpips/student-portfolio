# Student Portfolio & Academic Management Website

A responsive multi-page student portfolio built with **vanilla HTML, CSS and JavaScript** for the COS 106 term project.

## Pages

| Page             | File            | Purpose                                                     |
| ---------------- | --------------- | ----------------------------------------------------------- |
| Home             | `index.html`    | Photo, welcome message, nav, brief bio                      |
| About Me         | `about.html`    | Education table, career goals, skills, hobbies, intro audio |
| Projects         | `projects.html` | Project cards rendered from `assets/js/data/projects.json`  |
| Academic Planner | `planner.html`  | Add / complete / delete tasks (saved in `localStorage`)     |
| Contact          | `contact.html`  | Validated contact form with toast feedback                  |

## Running locally

This project uses `fetch()` to load `projects.json` and ES module `<script type="module">` tags. Both are blocked by the browser when a page is opened directly as a `file://` path. **Serve the folder instead:**

- **VS Code**: install the "Live Server" extension, right-click `index.html` → _Open with Live Server_.
- **Python**: run `python -m http.server 5500` in this folder, then visit `http://localhost:5500`.


## Project structure

```
├── index.html / about.html / projects.html / planner.html / contact.html
├── assets/
│   ├── css/
│   │   ├── main.css        # entry point (@imports everything below)
│   │   ├── variables.css   # design tokens: colours, spacing, fonts
│   │   ├── base.css        # reset + typography + utilities
│   │   ├── layout.css      # header, nav, footer
│   │   ├── components.css  # buttons, cards, forms, tables, toasts
│   │   ├── animations.css  # keyframes & transitions
│   │   └── pages.css       # page-specific layout
│   ├── js/
│   │   ├── main.js         # shared: nav init, footer year, scroll reveal
│   │   ├── navigation.js   # mobile menu + active link + sticky header
│   │   ├── notification.js # reusable toast/alert component
│   │   ├── projects.js     # fetches & renders projects.json
│   │   ├── planner.js      # task management (add/complete/delete)
│   │   ├── contact.js      # form validation
│   │   └── data/projects.json
│   ├── images/
│   └── media/
```

## Technical checklist

- **HTML**: semantic elements, forms, a data table, images, hyperlinks, lists, `<audio>` multimedia
- **CSS**: external stylesheet, responsive layout, Flexbox & Grid, animated nav/toasts/hover states, single consistent colour palette, mobile-friendly breakpoints
- **JavaScript**: event handling, DOM manipulation, form validation (empty fields, email format, digits-only phone), dynamic content from JSON + `localStorage`, arrays/functions, full task management system
