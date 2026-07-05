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
          <a class="btn btn-outline btn-sm" href="${project.github}" target="_blank" rel="noopener noreferrer">GitHub</a>
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
