const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
const taskCounter = document.getElementById("taskCounter");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", e => {
    if (e.key === "Enter") addTask();
});
searchInput.addEventListener("input", displayTasks);

function addTask() {
    const text = taskInput.value.trim();
    if (text === "") return alert("Please enter a task");

    tasks.push({
        id: Date.now(),
        text,
        completed: false
    });

    taskInput.value = "";
    saveAndRender();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveAndRender();
}

function toggleComplete(id) {
    tasks = tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveAndRender();
}

function editTask(id) {
    const task = tasks.find(t => t.id === id);
    const newText = prompt("Edit task:", task.text);
    if (newText !== null && newText.trim() !== "") {
        task.text = newText.trim();
        saveAndRender();
    }
}

function displayTasks() {
    taskList.innerHTML = "";
    const searchText = searchInput.value.toLowerCase();

    tasks
        .filter(task => task.text.toLowerCase().includes(searchText))
        .forEach(task => {
            const li = document.createElement("li");
            if (task.completed) li.classList.add("completed");

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = task.completed;
            checkbox.addEventListener("change", () => toggleComplete(task.id));

            const span = document.createElement("span");
            span.textContent = task.text;

            const editBtn = document.createElement("button");
            editBtn.textContent = "Edit";
            editBtn.className = "edit-btn";
            editBtn.onclick = () => editTask(task.id);

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "X";
            deleteBtn.className = "delete-btn";
            deleteBtn.onclick = () => deleteTask(task.id);

            li.append(checkbox, span, editBtn, deleteBtn);
            taskList.appendChild(li);
        });

    updateCounter();
}

function updateCounter() {
    const completed = tasks.filter(t => t.completed).length;
    taskCounter.textContent = `Total: ${tasks.length} | Completed: ${completed}`;
}

function saveAndRender() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayTasks();
}

displayTasks();
