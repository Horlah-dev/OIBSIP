const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const pendingList = document.getElementById("pending-list");
const completedList = document.getElementById("completed-list");
const pendingCount = document.getElementById("pending-count");
const completedCount = document.getElementById("completed-count");
const pendingEmpty = document.getElementById("pending-empty");
const completedEmpty = document.getElementById("completed-empty");

let tasks = [];

taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        return;
    }

    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false,
        createdAt: new Date().toLocaleString(),
    };

    tasks.push(newTask);
    taskInput.value = "";

    renderTasks();
});

function renderTasks() {
    pendingList.innerHTML = "";
    completedList.innerHTML = "";

    const pendingTasks = tasks.filter(function (task) {
        return !task.completed;
    });

    const completedTasks = tasks.filter(function (task) {
        return task.completed;
    });

    pendingTasks.forEach(function (task) {
        pendingList.appendChild(createTaskElement(task));
    });

    completedTasks.forEach(function (task) {
        completedList.appendChild(createTaskElement(task));
    });

    pendingCount.textContent = `${pendingTasks.length} pending`;
    completedCount.textContent = `${completedTasks.length} completed`;

    if (pendingTasks.length === 0) {
        pendingEmpty.style.display = "block";
    } else {
        pendingEmpty.style.display = "none";
    }

    if (completedTasks.length === 0) {
        completedEmpty.style.display = "block";
    } else {
        completedEmpty.style.display = "none";
    }
}

function createTaskElement(task) {
    const listItem = document.createElement("li");
    listItem.className = "task-item";

    const content = document.createElement("div");
    content.className = "task-content";

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;

    const time = document.createElement("small");
    time.className = "task-time";
    time.textContent = task.createdAt;

    content.appendChild(text);
    content.appendChild(time);

    const actions = document.createElement("div");
    actions.className = "task-actions";

    if (!task.completed) {
        const completeButton = document.createElement("button");
        completeButton.className = "complete-btn";
        completeButton.textContent = "Complete";

        completeButton.addEventListener("click", function () {
            completeTask(task.id);
        });

        actions.appendChild(completeButton);
    }

    const editButton = document.createElement("button");
    editButton.className = "edit-btn";
    editButton.textContent = "Edit";

    editButton.addEventListener("click", function () {
        editTask(task.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", function () {
        deleteTask(task.id);
    });

    actions.appendChild(editButton);
    actions.appendChild(deleteButton);

    listItem.appendChild(content);
    listItem.appendChild(actions);

    return listItem;
}

function completeTask(taskId) {
    const task = tasks.find(function (task) {
        return task.id === taskId;
    });

    task.completed = true;

    renderTasks();
}

function deleteTask(taskId) {
    tasks = tasks.filter(function (task) {
        return task.id !== taskId;
    });

    renderTasks();
}

function editTask(taskId) {
    const task = tasks.find(function (task) {
        return task.id === taskId;
    });

    const newText = prompt("Task", task.text);

    if (newText !== null && newText.trim() !== "") {
        task.text = newText.trim();
    }

    renderTasks();
}
