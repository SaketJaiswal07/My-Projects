const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');

document.addEventListener('DOMContentLoaded', loadTasks);

function addTask() {
    const taskText = taskInput.value.trim();
    const priority = prompt("Enter priority for this task (low, medium, high):", "low").toLowerCase();

    if (taskText === '' || (priority !== 'low' && priority !== 'medium' && priority !== 'high')) {
        alert('Please enter a task and a valid priority (low, medium, high)!');
        return;
    }

    const task = {
        text: taskText,
        completed: false,
        priority: priority
    };

    saveTaskToLocalStorage(task);
    reloadTasks();
    taskInput.value = '';
}

function addTaskToList(task) {
    const li = document.createElement('li');
    li.textContent = `${task.text}`;

    if (task.completed) {
        li.classList.add('completed');
    }

    const completeBtn = document.createElement('button');
    completeBtn.textContent = 'Complete';
    completeBtn.addEventListener('click', () => {
        task.completed = !task.completed;
        li.classList.toggle('completed');
        updateTaskInLocalStorage(task.text, task);
    });

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => {
        editTask(task);
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => {
        li.remove();
        removeTaskFromLocalStorage(task.text);
    });

    li.appendChild(completeBtn);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
}

function editTask(task) {
    const newTaskText = prompt("Edit the task description:", task.text);
    const newPriority = prompt("Edit the priority (low, medium, high):", task.priority).toLowerCase();

    if (newTaskText === '' || (newPriority !== 'low' && newPriority !== 'medium' && newPriority !== 'high')) {
        alert('Please enter a valid task and priority (low, medium, high)!');
        return;
    }

    task.text = newTaskText;
    task.priority = newPriority;

    updateTaskInLocalStorage(newTaskText, task);
    reloadTasks();
}

function saveTaskToLocalStorage(task) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    tasks = sortTasksByPriority(tasks);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateTaskInLocalStorage(taskText, updatedTask) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.map(task => task.text === taskText ? updatedTask : task);
    tasks = sortTasksByPriority(tasks);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function removeTaskFromLocalStorage(taskText) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.text !== taskText);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = sortTasksByPriority(tasks);
    taskList.innerHTML = '';
    tasks.forEach(task => addTaskToList(task));
}

function reloadTasks() {
    taskList.innerHTML = '';
    loadTasks();
}

function sortTasksByPriority(tasks) {
    const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
    return tasks.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
}

addTaskBtn.addEventListener('click', addTask);

taskInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        addTask();
    }
});