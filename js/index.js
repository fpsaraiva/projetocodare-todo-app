let todoList = [];
const inputElement = document.getElementById('todo-input');
const listElement = document.getElementById('todo-list');
const counterTextElement = document.getElementById('todo-counter-text');

inputElement.onkeydown = function (event) {
  if(event.key == 'Enter') handleAddItem();
};

function handleAddItem() {
  const inputValue = inputElement.value;

  if(inputValue === '') return;
  
  const newTodoItem = {
    id: Date.now(),
    name: inputValue,
    status: 'Pending'
  }
  todoList.push(newTodoItem);
  render();
  
  inputElement.value = '';
  inputElement.focus();
}

function render() {
  listElement.innerHTML = '';

  todoList.forEach(function(listItem) {
    const todoItemElement = document.createElement('li');

    todoItemElement.classList = 'todo-list-item';
    todoItemElement.id = listItem.id;
    todoItemElement.innerHTML = getTodoItemContentByTodo(listItem);

    const deleteButton = todoItemElement.querySelector(`#trash_${listItem.id}`);
    deleteButton.onclick = function () {
      handleDeleteTodoById(listItem.id);
    };

    const toogleButton = todoItemElement.querySelector(`#toggle_${listItem.id}`);
    toogleButton.onclick = function() {
      handleToggleTodoItemById(listItem.id);
    };

    const todoCheckbox = todoItemElement.querySelector(`#check_${listItem.id}`);
    todoCheckbox.onclick = function () {
      handleToggleTodoItemById(listItem.id);
    }

    listElement.append(todoItemElement);
  });

  const pendingTodos = todoList.filter(listItem => listItem.status == 'Pending');
  counterTextElement.innerHTML = 'Você tem ';
  counterTextElement.innerHTML += pendingTodos.length;
  counterTextElement.innerHTML += pendingTodos.length == 1 ? ' tarefa pendente' : ' tarefas pendentes';

  saveState();
}

function getTodoItemContentByTodo(listItem) {
  return `
  <div class="todo-list-item-content">
    <input 
      type="checkbox" 
      class="todo-item-check" 
      ${listItem.status == 'Done' ? 'checked' : ''}
      id="check_${listItem.id}"
      >
    <span class="todo-item-text">${listItem.name}</span>
  </div>
  <div class="todo-list-item-actions">
    <button class="purple-background" id="toggle_${listItem.id}">
      <img src="./assets/checkmark.svg" alt="botão de completar tarefa">
    </button>
    <button class="orange-background" id="trash_${listItem.id}">
      <img src="./assets/trash.svg" alt="botão de deletar tarefa">
    </button>
  </div>
`;
}

function handleDeleteTodoById(todoId) {
  const todoListOnlyId = todoList.map(function(listItem) {
    return listItem.id;
  });

  const removeTodoIndex = todoListOnlyId.indexOf(todoId);
  todoList.splice(removeTodoIndex, 1);
  
  render();
}

function handleToggleTodoItemById(todoId) {
  const todoItemToToggle = todoList.find(function(todoItem) {
    return todoItem.id == todoId;
  });
  
  if(todoItemToToggle.status === 'Pending') {
    todoItemToToggle.status = 'Done';
  } else {
    todoItemToToggle.status = 'Pending';
  }

  render();
}

function handleClearAll() {
  todoList = [];
  render();
}

function saveState() {
  localStorage.setItem('state', JSON.stringify(todoList));
}

function getState() {
  const state = localStorage.getItem('state');
  todoList = JSON.parse(state);
  render();
}

window.onload = getState;