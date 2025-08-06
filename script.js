const todoValue = document.getElementById("todoInput");
const addUpdate = document.getElementById("addUpdateButton");
const todoList = document.getElementById("todoList");
const themeSelect = document.getElementById("themeSelect");
const filterSelect = document.getElementById("filterSelect");

let editIndex = null;
let todos = JSON.parse(localStorage.getItem("todos")) || [];

function renderTodos(filter = "all") {
  todoList.innerHTML = "";
  todos.forEach((todo, index) => {
    if (
      (filter === "active" && todo.completed) ||
      (filter === "completed" && !todo.completed)
    ) {
      return;
    }

    const li = document.createElement("li");
    li.classList.add("todo-item");
    if (todo.completed) li.classList.add("completed");

    const text = document.createElement("span");
    text.textContent = todo.text;
    text.className = "todo-text";
    text.onclick = () => toggleComplete(index);

    const tag = document.createElement("span");
    tag.textContent = todo.tag || "General";
    tag.className = "todo-tag";

    const editBtn = document.createElement("img");
    editBtn.src = "/images/pencil.png";
    editBtn.className = "todo-controls";
    editBtn.onclick = () => selectForEdit(index);

    const delBtn = document.createElement("img");
    delBtn.src = "/images/delete.png";
    delBtn.className = "todo-controls";
    delBtn.onclick = () => deleteTodo(index);

    li.append(text, tag, editBtn, delBtn);
    todoList.appendChild(li);
  });
}

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function CreateToDoItems() {
  const value = todoValue.value.trim();
  if (!value) return alert("Please enter a todo item.");

  const tag = prompt("Enter a tag or category (optional):", "General") || "General";

  todos.push({ text: value, completed: false, tag });
  saveTodos();
  renderTodos(filterSelect.value);
  todoValue.value = "";
}

function selectForEdit(index) {
  todoValue.value = todos[index].text;
  addUpdate.innerText = "Update";
  addUpdate.setAttribute("onclick", "UpdateOnSelectionItems()")
  editIndex = index;
}

function UpdateOnSelectionItems() {
  if (editIndex === null) return;
  todos[editIndex].text = todoValue.value.trim();
  saveTodos();
  renderTodos(filterSelect.value);
  todoValue.value = "";
  addUpdate.innerText = "Add";
  addUpdate.setAttribute("onclick", "CreateToDoItems()");
  editIndex = null;
}

function deleteTodo(index) {
  todos.splice(index, 1);
  saveTodos();
  renderTodos(filterSelect.value);
}

function toggleComplete(index) {
  todos[index].completed = !todos[index].completed;
  saveTodos();
  renderTodos(filterSelect.value);
}

// Theme selection with transition
function applyTheme(theme) {
  document.body.classList.remove("light-theme", "dark-theme", "blue-theme");
  document.body.classList.add(`${theme}-theme`);
  localStorage.setItem("theme", theme);
}

themeSelect.addEventListener("change", (e) => {
  applyTheme(e.target.value);
});

const savedTheme = localStorage.getItem("theme") || "light";
themeSelect.value = savedTheme;
applyTheme(savedTheme);

// Press Enter to add item

todoValue.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    if (addUpdate.innerText === "Add") {
      CreateToDoItems();
    } else {
      UpdateOnSelectionItems();
    }
  }
});

// Filter
filterSelect.addEventListener("change", (e) => {
  renderTodos(e.target.value);
});

// Preload images
["/images/pencil.png", "/images/delete.png"].forEach((src) => {
  const img = new Image();
  img.src = src;
});

// Initial render
renderTodos();
