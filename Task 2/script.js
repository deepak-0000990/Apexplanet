const taskForm = document.querySelector('#task-form');
const taskInput = document.querySelector('#task-input');
const taskList = document.querySelector('#task-list');
const taskCount = document.querySelector('#task-count');
const clearCompleted = document.querySelector('#clear-completed');

function updateTaskCount() {
  const remaining = taskList.querySelectorAll('.task-item:not(.done)').length;
  taskCount.textContent = `${remaining} ${remaining === 1 ? 'thing' : 'things'} on your list`;
}

function addTask(label, completed = false) {
  const item = document.createElement('li');
  item.className = `task-item${completed ? ' done' : ''}`;
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = completed;
  checkbox.setAttribute('aria-label', `Mark ${label} as complete`);
  const text = document.createElement('span');
  text.textContent = label;
  const remove = document.createElement('button');
  remove.type = 'button';
  remove.className = 'delete-task';
  remove.setAttribute('aria-label', `Remove ${label}`);
  remove.textContent = '×';
  checkbox.addEventListener('change', () => {
    item.classList.toggle('done', checkbox.checked);
    updateTaskCount();
  });
  remove.addEventListener('click', () => { item.remove(); updateTaskCount(); });
  item.append(checkbox, text, remove);
  taskList.append(item);
  updateTaskCount();
}

taskForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = taskInput.value.trim();
  if (!value) return;
  addTask(value);
  taskInput.value = '';
  taskInput.focus();
});

clearCompleted.addEventListener('click', () => {
  taskList.querySelectorAll('.task-item.done').forEach((item) => item.remove());
  updateTaskCount();
});

const contactForm = document.querySelector('#contact-form');
const formStatus = document.querySelector('#form-status');
const fields = {
  name: { input: document.querySelector('#name'), error: document.querySelector('#name-error') },
  email: { input: document.querySelector('#email'), error: document.querySelector('#email-error') },
  message: { input: document.querySelector('#message'), error: document.querySelector('#message-error') }
};

function validateField(key) {
  const { input, error } = fields[key];
  const value = input.value.trim();
  let message = '';
  if (!value) message = 'Please fill in this field.';
  else if (key === 'name' && value.length < 2) message = 'Please enter at least 2 characters.';
  else if (key === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) message = 'Enter a valid email address.';
  else if (key === 'message' && value.length < 10) message = 'Add a little more detail (10 characters minimum).';
  error.textContent = message;
  input.setAttribute('aria-invalid', String(Boolean(message)));
  return !message;
}

Object.keys(fields).forEach((key) => {
  fields[key].input.addEventListener('blur', () => validateField(key));
  fields[key].input.addEventListener('input', () => {
    if (fields[key].input.getAttribute('aria-invalid') === 'true') validateField(key);
  });
});

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const valid = Object.keys(fields).map(validateField).every(Boolean);
  if (!valid) {
    formStatus.classList.remove('success');
    formStatus.textContent = 'Please check the highlighted fields.';
    contactForm.querySelector('[aria-invalid="true"]')?.focus();
    return;
  }
  formStatus.classList.add('success');
  formStatus.textContent = 'Thanks for your note — it’s ready to send!';
  contactForm.reset();
  Object.values(fields).forEach(({ input }) => input.removeAttribute('aria-invalid'));
});

const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.navigation');
menuToggle.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
});
navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  navigation.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
}));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && navigation.classList.contains('open')) {
    navigation.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    menuToggle.focus();
  }
});
