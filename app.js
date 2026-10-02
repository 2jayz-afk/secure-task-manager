'use strict';


const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const loadSamplesBtn = document.getElementById('loadSamplesBtn');
const taskList = document.getElementById('taskList');
const taskMessage = document.getElementById('taskMessage');
const totalCount = document.getElementById('totalCount');
const pendingCount = document.getElementById('pendingCount');
const completedCount = document.getElementById('completedCount');

let taskIdCounter = 0;

function createTaskElement(taskText, taskId) {
  const li = document.createElement('li');
  li.className = 'task-item';
  li.dataset.taskId = taskId;
  li.dataset.state = 'pending';

  const textSpan = document.createElement('span');
  textSpan.className = 'task-text';
  textSpan.textContent = taskText;

  const completeBtn = document.createElement('button');
  completeBtn.type = 'button';
  completeBtn.className = 'complete-btn';
  completeBtn.textContent = 'Complete';

  const editBtn = document.createElement('button');
  editBtn.type = 'button';
  editBtn.className = 'edit-btn';
  editBtn.textContent = 'Edit';

  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.className = 'remove-btn';
  removeBtn.textContent = 'Remove';

  li.appendChild(textSpan);
  li.appendChild(completeBtn);
  li.appendChild(editBtn);
  li.appendChild(removeBtn);

  return li;
}

function addTask(taskText) {
  const trimmed = taskText.trim();

  if (trimmed === '') {
    taskMessage.textContent = 'Task cannot be empty';
    return;
  }

  taskIdCounter += 1;
  const taskId = 'task-' + taskIdCounter;

  const taskElement = createTaskElement(trimmed, taskId);
  taskList.appendChild(taskElement);

  taskInput.value = '';
  taskMessage.textContent = '';
  updateTaskCounts();
}

function toggleTaskComplete(taskItem) {
  taskItem.classList.toggle('completed');

  if (taskItem.classList.contains('completed')) {
    taskItem.dataset.state = 'completed';
  } else {
    taskItem.dataset.state = 'pending';
  }

  updateTaskCounts();
}

function beginTaskEdit(taskItem) {
  const textSpan = taskItem.querySelector('.task-text');
  if (!textSpan) return;

  const currentText = textSpan.textContent;

  const editInput = document.createElement('input');
  editInput.type = 'text';
  editInput.className = 'edit-input';
  editInput.value = currentText;

  textSpan.replaceWith(editInput);
  editInput.focus();
  editInput.select();

  const editBtn = taskItem.querySelector('.edit-btn');
  if (editBtn) {
    editBtn.textContent = 'Save';
  }
}

function saveTaskEdit(taskItem) {
  const editInput = taskItem.querySelector('.edit-input');
  if (!editInput) return;

  const trimmed = editInput.value.trim();

  if (trimmed === '') {
    taskMessage.textContent = 'Task cannot be empty';
    return;
  }

  const textSpan = document.createElement('span');
  textSpan.className = 'task-text';
  textSpan.textContent = trimmed;

  editInput.replaceWith(textSpan);

  const editBtn = taskItem.querySelector('.edit-btn');
  if (editBtn) {
    editBtn.textContent = 'Edit';
  }

  taskMessage.textContent = '';
}

function removeTask(taskItem) {
  taskItem.remove();
  updateTaskCounts();
}

function updateTaskCounts() {
  const items = taskList.querySelectorAll('.task-item');
  let pending = 0;
  let completed = 0;

  items.forEach(function (item) {
    if (item.dataset.state === 'completed') {
      completed += 1;
    } else {
      pending += 1;
    }
  });

  totalCount.textContent = String(items.length);
  pendingCount.textContent = String(pending);
  completedCount.textContent = String(completed);
}
function handleTaskListClick(event) {
  const target = event.target;
  const taskItem = target.closest('.task-item');
  if (!taskItem) return;

  if (target.classList.contains('complete-btn') || target.matches('.complete-btn')) {
    toggleTaskComplete(taskItem);
    return;
  }

  if (target.classList.contains('edit-btn') || target.matches('.edit-btn')) {
    if (target.textContent === 'Save') {
      saveTaskEdit(taskItem);
    } else {
      beginTaskEdit(taskItem);
    }
    return;
  }

  if (target.classList.contains('remove-btn') || target.matches('.remove-btn')) {
    removeTask(taskItem);
    return;
  }
}

function loadSampleTasks() {
  const samples = [
    'Review DOM selectors',
    'Practice createElement',
    'Study event delegation'
  ];

  const fragment = document.createDocumentFragment();

  samples.forEach(function (text) {
    taskIdCounter += 1;
    const taskId = 'task-' + taskIdCounter;
    const element = createTaskElement(text, taskId);
    fragment.appendChild(element);
  });

  taskList.appendChild(fragment);
  updateTaskCounts();
}

addTaskBtn.addEventListener('click', function () {
  addTask(taskInput.value);
});

taskInput.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    addTask(taskInput.value);
  }
});

loadSamplesBtn.addEventListener('click', loadSampleTasks);


taskList.addEventListener('click', handleTaskListClick);


updateTaskCounts();
