/**
 * Contact form validation.
 * Rules: no field may be empty, email must look like a valid email address,
 * and phone must contain digits only.
 */
import { showNotification } from './notification.js';

const form = document.getElementById('contact-form');
const fields = {
  name: form.querySelector('#name'),
  email: form.querySelector('#email'),
  phone: form.querySelector('#phone'),
  message: form.querySelector('#message'),
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\d+$/;

function setError(field, message) {
  const errorEl = document.getElementById(`${field.id}-error`);
  const hasError = Boolean(message);

  field.classList.toggle('is-invalid', hasError);
  if (errorEl) errorEl.textContent = message || '';
  return !hasError;
}

function validateField(field) {
  const value = field.value.trim();

  if (!value) {
    return setError(field, 'This field is required.');
  }

  if (field === fields.email && !EMAIL_PATTERN.test(value)) {
    return setError(field, 'Enter a valid email address (e.g. name@example.com).');
  }

  if (field === fields.phone && !PHONE_PATTERN.test(value.replace(/[\s-]/g, ''))) {
    return setError(field, 'Phone number must contain digits only.');
  }

  return setError(field, '');
}

Object.values(fields).forEach((field) => {
  field.addEventListener('blur', () => validateField(field));
  field.addEventListener('input', () => {
    if (field.classList.contains('is-invalid')) validateField(field);
  });
});

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const results = Object.values(fields).map(validateField);
  const isValid = results.every(Boolean);

  if (!isValid) {
    showNotification('Please fix the highlighted fields and try again.', 'error');
    const firstInvalid = Object.values(fields).find((field) => field.classList.contains('is-invalid'));
    firstInvalid?.focus();
    return;
  }

  const name = fields.name.value.trim();
  form.reset();
  Object.values(fields).forEach((field) => field.classList.remove('is-invalid'));
  showNotification(`Thanks, ${name}! Your message has been sent. I'll get back to you soon.`, 'success');
});
