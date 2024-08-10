document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');

    // Load todos from localStorage
    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    // Function to render the todo list
    function renderTodos() {
        todoList.innerHTML = '';
        todos.forEach((todo, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${todo}
                <button onclick="deleteTodo(${index})">Delete</button>
            `;
            todoList.appendChild(li);
        });
    }

    // Function to add a new todo
    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newTodo = todoInput.value;
        todos.push(newTodo);
        localStorage.setItem('todos', JSON.stringify(todos));
        todoInput.value = '';
        renderTodos();
    });

    // Function to delete a todo
    window.deleteTodo = function(index) {
        todos.splice(index, 1);
        localStorage.setItem('todos', JSON.stringify(todos));
        renderTodos();
    };

    // Initial render
    renderTodos();
});
