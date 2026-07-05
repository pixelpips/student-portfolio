/**
 * Academic Planner: an interactive task list backed by an in-memory array
 * and persisted to localStorage. Demonstrates add / complete / delete,
 * array methods, event delegation, and DOM manipulation.
 */
import { showNotification } from './notification.js';

const STORAGE_KEY = 'academicPlannerTasks';

const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');
const emptyState = document.getElementById('task-empty');
const countLabel = document.getElementById('task-count');
const filterButtons = document.querySelectorAll('.planner-filter');

const seedTasks = [
  { id: 1, text: 'Read Chapter 3 of Introduction to Web Technologies', completed: false },
  { id: 2, text: 'Submit COS 106 term project', completed: false },
  { id: 3, text: 'Review lecture notes on CSS Flexbox', completed: true },
];

let tasks = loadTasks();
let filter = 'all';

function loadTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : seedTasks;
  } catch {
    return seedTasks;
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function taskRow(task) {
  return `
    <li class="task-item${task.completed ? ' is-complete' : ''}" data-id="${task.id}">
      <button type="button" class="task-checkbox${task.completed ? ' is-checked' : ''}"
        aria-label="Mark task as ${task.completed ? 'active' : 'completed'}">
        ${task.completed ? '✓' : ''}
      </button>
      <span class="task-text">${task.text}</span>
      <button type="button" class="task-delete" aria-label="Delete task">&times;</button>
    </li>
  `;
}

function render() {
  const visible = tasks.filter((task) => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  list.innerHTML = visible.map(taskRow).join('');
  emptyState.hidden = visible.length !== 0;

  const remaining = tasks.filter((task) => !task.completed).length;
  countLabel.textContent = `${remaining} task${remaining === 1 ? '' : 's'} remaining`;
}

function addTask(text) {
  const task = { id: Date.now(), text, completed: false };
  tasks = [task, ...tasks];
  saveTasks();
  render();
  showNotification('Task added to your planner.', 'success');
}

function toggleTask(id) {
  tasks = tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task));
  saveTasks();
  render();
}

function deleteTask(id) {
  const row = list.querySelector(`[data-id="${id}"]`);
  const finish = () => {
    tasks = tasks.filter((task) => task.id !== id);
    saveTasks();
    render();
    showNotification('Task deleted.', 'info');
  };

  if (row) {
    row.classList.add('is-removing');
    row.addEventListener('transitionend', finish, { once: true });
  } else {
    finish();
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = input.value.trim();

  if (!text) {
    showNotification('Please enter a task before adding it.', 'error');
    input.focus();
    return;
  }

  addTask(text);
  form.reset();
  input.focus();
});

list.addEventListener('click', (event) => {
  const row = event.target.closest('.task-item');
  if (!row) return;
  const id = Number(row.dataset.id);

  if (event.target.closest('.task-checkbox')) toggleTask(id);
  if (event.target.closest('.task-delete')) deleteTask(id);
});

filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    filter = btn.dataset.filter;
    filterButtons.forEach((b) => b.classList.toggle('is-active', b === btn));
    render();
  });
});

render();
