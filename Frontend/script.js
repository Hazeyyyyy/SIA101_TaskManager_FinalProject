const API = 'https://taskmanagerdraft.onrender.com/api/tasks';

// dom //
const form = document.getElementById('form');
const input = document.getElementById('taskInput');
const list = document.getElementById('list');
const categoryInput = document.getElementById('categoryInput');
const searchInput = document.getElementById('searchInput');
const filterCategory = document.getElementById('filterCategory');
const notifications = document.getElementById('notifications');
const loading = document.getElementById('loading');

const totalCount = document.getElementById('totalCount');
const completedCount = document.getElementById('completedCount');
const pendingCount = document.getElementById('pendingCount');

// load task from backend //
async function fetchTasks() {
  const res = await fetch(API);
  const data = await res.json();
  renderTasks(data);
}

// render tasks //
function renderTasks(taskArray) {
  list.innerHTML = '';

  taskArray.forEach((task) => {
    const li = document.createElement('li');
    li.classList.add('task-item', task.category);

    if (task.completed) {
      li.classList.add('completed');
    }

    li.innerHTML = `
            <span>${task.text}</span>
            <div>
                <small>${task.category}</small>
                <button class="deleteBtn">Delete</button>
            </div>
        `;

    // toggle tasks //
    li.addEventListener('click', async function (e) {
      if (e.target.classList.contains('deleteBtn')) return;

      await fetch(`${API}/${task.id}/toggle`, {
        method: 'PATCH',
      });

      fetchTasks();
    });

    // delete task //
    li.querySelector('.deleteBtn').addEventListener(
      'click',
      async function (e) {
        e.stopPropagation();

        await fetch(`${API}/${task.id}`, {
          method: 'DELETE',
        });

        showNotification('Task deleted!', 'error');
        fetchTasks();
      }
    );

    // edit task //
    li.querySelector('span').addEventListener('dblclick', async function (e) {
      e.stopPropagation();

      const newText = prompt('Edit task:', task.text);

      if (newText && newText.trim() !== '') {
        await fetch(`${API}/${task.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: newText,
          }),
        });

        showNotification('Task updated!', 'success');
        fetchTasks();
      }
    });

    list.appendChild(li);
  });

  updateCounter(taskArray);
}

// add task //
form.addEventListener('submit', async function (event) {
  event.preventDefault();

  if (input.value.trim() === '') {
    showNotification('Please enter a task!', 'error');
    return;
  }

  showLoading();

  await fetch(API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: input.value,
      category: categoryInput.value,
    }),
  });

  input.value = '';
  hideLoading();

  showNotification('Task added!', 'success');
  fetchTasks();
});

// search //
searchInput.addEventListener('input', function (event) {
  const value = event.target.value.toLowerCase();

  fetch(API)
    .then((res) => res.json())
    .then((data) => {
      const filtered = data.filter((task) =>
        task.text.toLowerCase().includes(value)
      );
      renderTasks(filtered);
    });
});

// filter //
filterCategory.addEventListener('change', function () {
  fetch(API)
    .then((res) => res.json())
    .then((data) => {
      if (filterCategory.value === 'All') {
        renderTasks(data);
      } else {
        renderTasks(data.filter((t) => t.category === filterCategory.value));
      }
    });
});

// counter //
function updateCounter(tasks) {
  const completed = tasks.filter((t) => t.completed).length;
  const pending = tasks.length - completed;

  totalCount.innerText = tasks.length;
  completedCount.innerText = completed;
  pendingCount.innerText = pending;
}

// notif //
function showNotification(message, type = 'info', duration = 2000) {
  const div = document.createElement('div');
  div.className = `notification ${type}`;
  div.innerText = message;

  notifications.appendChild(div);

  setTimeout(() => {
    div.remove();
  }, duration);
}

function showLoading() {
  loading.classList.remove('hidden');
}

function hideLoading() {
  loading.classList.add('hidden');
}

fetchTasks();
