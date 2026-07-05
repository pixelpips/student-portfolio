/**
 * Projects page: loads assets/js/data/projects.json and renders it into
 * cards. Also builds a simple tag filter from whatever tags exist in the data.
 */
import { showNotification } from "./notification.js";

const DATA_URL = "assets/js/data/projects.json";

const grid = document.getElementById("projects-grid");
const toolbar = document.getElementById("projects-toolbar");

let projects = [];
let activeTag = "All";

function renderToolbar() {
  const tags = [
    "All",
    ...new Set(projects.flatMap((project) => project.tags ?? [])),
  ];

  toolbar.innerHTML = tags
    .map(
      (tag) => `
        <button type="button" class="filter-chip${tag === activeTag ? " is-active" : ""}" data-tag="${tag}">
          ${tag}
        </button>`,
    )
    .join("");

  toolbar.querySelectorAll(".filter-chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeTag = btn.dataset.tag;
      renderToolbar();
      renderGrid();
    });
  });
}

function githubButton(project) {
  if (project.github) {
    return `<a class="btn btn-outline btn-sm" href="${project.github}" target="_blank" rel="noopener noreferrer">GitHub</a>`;
  }

  return `
    <span class="btn btn-outline btn-sm btn-disabled" title="Source code is in a private repository">
      <svg class="social-icon" viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true">
        <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
      </svg>
      Private Repo
    </span>`;
}

function projectCard(project) {
  const tags = (project.tags ?? [])
    .map((tag) => `<span class="tag">${tag}</span>`)
    .join("");

  return `
    <article class="card project-card">
      <div class="project-thumb">
        <img src="${project.image}" alt="Preview screenshot of ${project.title}" loading="lazy" />
      </div>
      <div class="project-body">
        <h3>${project.title}</h3>
        <p class="project-desc">${project.description}</p>
        <div class="tag-list">${tags}</div>
        <div class="project-links">
          <a class="btn btn-primary btn-sm" href="${project.preview}" target="_blank" rel="noopener noreferrer">Live Preview</a>
          ${githubButton(project)}
        </div>
      </div>
    </article>
  `;
}

function renderGrid() {
  const visible =
    activeTag === "All"
      ? projects
      : projects.filter((project) => (project.tags ?? []).includes(activeTag));

  if (!visible.length) {
    grid.innerHTML = `<p class="projects-state">No projects match "${activeTag}" yet.</p>`;
    return;
  }

  grid.innerHTML = visible.map(projectCard).join("");
}

async function loadProjects() {
  grid.innerHTML =
    '<div class="projects-state"><span class="spinner"></span><p>Loading projects…</p></div>';

  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    projects = await response.json();
    renderToolbar();
    renderGrid();
  } catch (error) {
    grid.innerHTML = `
      <p class="projects-state">
        Couldn't load projects.
      </p>`;
    showNotification(
      "Could not load project data. See the projects page for details.",
      "error",
    );
  }
}

loadProjects();
