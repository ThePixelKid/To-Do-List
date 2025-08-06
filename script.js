// Element Selectors
const todoValue = document.getElementById("todoText");
const todoAlert = document.getElementById("Alert");
const listItems = document.getElementById("list-items");
const addUpdate = document.getElementById("AddUpdateClick");

let updateText = null;

// LocalStorage Initialization
let todo = JSON.parse(localStorage.getItem("todo-list"));
if (!todo) {
  todo = [];
}

// Save to Local Storage
function setLocalStorage() {
  localStorage.setItem("todo-list", JSON.stringify(todo));
}

// Set Alert Messages
function setAlertMessage(message) {
  todoAlert.removeAttribute("class");
  todoAlert.innerText = message;
  setTimeout(() => {
    todoAlert.classList.add("toggleMe");
  }, 1000);
}

// CREATE Todo
function CreateToDoItems() {
  if (todoValue.value === "") {
    todoAlert.innerText = "Please enter your todo text!";
    todoValue.focus();
    return;
  }

  let isPresent = todo.some((element) => element.item === todoValue.value);
  if (isPresent) {
    setAlertMessage("This item already present in the list!");
    return;
  }

  let li = document.createElement("li");
  const todoItems = `
    <div title="Double-click to mark complete" ondblclick="CompletedToDoItems(this)">
      ${todoValue.value}
    </div>
    <div>
      <img class="edit todo-controls" onclick="UpdateToDoItems(this)" src="/images/pencil.png" />
      <img class="delete todo-controls" onclick="DeleteToDoItems(this)" src="/images/delete.png" />
    </div>`;
  li.innerHTML = todoItems;
  listItems.appendChild(li);

  todo.push({ item: todoValue.value, status: false });
  setLocalStorage();

  todoValue.value = "";
  setAlertMessage("Todo item Created Successfully!");
}

// READ Todo
function ReadToDoItems() {
  todo.forEach((element) => {
    let li = document.createElement("li");
    let style = element.status ? "style='text-decoration: line-through'" : "";
    const checkIcon = element.status
      ? '<img class="todo-controls" src="/images/check-mark.png" />'
      : "";

    const editIcon = !element.status
      ? '<img class="edit todo-controls" onclick="UpdateToDoItems(this)" src="/images/pencil.png" />'
      : "";

    li.innerHTML = `
      <div ${style} title="Double-click to mark complete" ondblclick="CompletedToDoItems(this)">
        ${element.item}
        ${checkIcon}
      </div>
      <div>
        ${editIcon}
        <img class="delete todo-controls" onclick="DeleteToDoItems(this)" src="/images/delete.png" />
      </div>`;
    listItems.appendChild(li);
  });
}

// UPDATE (Start Edit Mode)
function UpdateToDoItems(e) {
  const taskDiv = e.parentElement.parentElement.querySelector("div");
  if (taskDiv.style.textDecoration === "") {
    todoValue.value = taskDiv.innerText.trim();
    updateText = taskDiv;
    addUpdate.setAttribute("onclick", "UpdateOnSelectionItems()");
    addUpdate.setAttribute("src", "/images/refresh.png");
    todoValue.focus();
  }
}

// UPDATE (Save Edit)
function UpdateOnSelectionItems() {
  let isPresent = todo.some((element) => element.item === todoValue.value);
  if (isPresent) {
    setAlertMessage("This item already present in the list!");
    return;
  }

  todo.forEach((element) => {
    if (element.item === updateText.innerText.trim()) {
      element.item = todoValue.value;
    }
  });
  setLocalStorage();

  updateText.innerText = todoValue.value;
  addUpdate.setAttribute("onclick", "CreateToDoItems()");
  addUpdate.setAttribute("src", "/images/plus.png");
  todoValue.value = "";
  setAlertMessage("Todo item Updated Successfully!");
}

// DELETE Todo
function DeleteToDoItems(e) {
  const deleteValue = e.parentElement.parentElement.querySelector("div").innerText.trim();
  const confirmDelete = confirm(`Are you sure you want to delete "${deleteValue}"?`);
  if (!confirmDelete) return;

  e.parentElement.parentElement.classList.add("deleted-item");
  todoValue.focus();

  todo = todo.filter((element) => element.item !== deleteValue);

  setTimeout(() => {
    e.parentElement.parentElement.remove();
  }, 1000);

  setLocalStorage();
  setAlertMessage("Todo item Deleted Successfully!");
}

// COMPLETE Todo
function CompletedToDoItems(e) {
  const taskDiv = e.parentElement.querySelector("div");
  if (taskDiv.style.textDecoration === "") {
    const img = document.createElement("img");
    img.src = "/images/check-mark.png";
    img.className = "todo-controls";
    taskDiv.style.textDecoration = "line-through";
    taskDiv.appendChild(img);

    const editIcon = e.parentElement.querySelector("img.edit");
    if (editIcon) editIcon.remove();

    todo.forEach((element) => {
      if (element.item === taskDiv.innerText.trim()) {
        element.status = true;
      }
    });

    setLocalStorage();
    setAlertMessage("Todo item Completed Successfully!");
  }
}

// Initialize List
ReadToDoItems();
