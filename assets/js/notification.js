/**
 * Reusable toast notification component.
 * Import `showNotification` anywhere a page needs to give the user feedback.
 */

const ICONS = {
  success: "✓",
  error: "✕",
  info: "i",
};

function getToastRegion() {
  let region = document.querySelector(".toast-region");
  if (!region) {
    region = document.createElement("div");
    region.className = "toast-region";
    region.setAttribute("aria-live", "polite");
    region.setAttribute("aria-atomic", "true");
    document.body.appendChild(region);
  }
  return region;
}

export function showNotification(message, type = "success", duration = 4000) {
  const region = getToastRegion();

  const toast = document.createElement("div");
  toast.className = `toast toast--${type}`;
  toast.setAttribute("role", "status");

  toast.innerHTML = `
    <span class="toast-icon">${ICONS[type] ?? ICONS.info}</span>
    <span class="toast-message">${message}</span>
    <button type="button" class="toast-close" aria-label="Dismiss notification">&times;</button>
    <span class="toast-progress" style="animation-duration:${duration}ms"></span>
  `;

  region.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add("is-visible"));

  const remove = () => {
    toast.classList.remove("is-visible");
    toast.addEventListener("transitionend", () => toast.remove(), {
      once: true,
    });
  };

  const timer = setTimeout(remove, duration);

  toast.querySelector(".toast-close").addEventListener("click", () => {
    clearTimeout(timer);
    remove();
  });

  return toast;
}
