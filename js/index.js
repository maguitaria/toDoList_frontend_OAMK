/**
 * @fileoverview This file is rendering the TodoList on the page (appending and fetching URL)
 */
const BACKEND_ROOT_URL = 'https://todo-backend-4kqy.onrender.com';
import { Todo } from "./class/Todo.js";
const todos = new Todo(BACKEND_ROOT_URL);
const list = document.querySelector('.todo-list');
const input = document.getElementById('todo-input');
const input_button = document.querySelector('.todo-btn');
const standardTheme = document.querySelector('.standard-theme');
const lightTheme = document.querySelector('.light-theme');
const darkerTheme = document.querySelector('.darker-theme');
// Event listeners to change the theme
standardTheme.addEventListener('click', () => changeTheme('standard'));
lightTheme.addEventListener('click', () => changeTheme('light'));
darkerTheme.addEventListener('click', () => changeTheme('darker'));
// Check if one theme has been set previously and apply it (or std theme if not found):
let savedTheme = localStorage.getItem('savedTheme');
savedTheme === null ?
    changeTheme('standard')
    : savedTheme;
input.disabled = true;
todos.getTasks()
    .then((tasks) => {
    tasks.forEach((task) => {
        renderTask(task);
    });
    input.disabled = false;
}).catch(error => {
    alert(error);
});
input.addEventListener('keypress', event => {
    if (event.key === 'Enter') {
        const text = input.value.trim();
        if (text !== '') {
            todos.addTask(text)
                .then((task) => {
                input.value = '';
                input.focus();
                renderTask(task);
            });
        }
        else {
            alert("You must write something!");
        }
        event.preventDefault();
    }
});
input_button.addEventListener('click', event => {
    const text = input.value.trim();
    if (text !== '') {
        todos.addTask(text)
            .then((task) => {
            input.value = '';
            input.focus();
            renderTask(task);
        });
    }
    else {
        alert("You must write something!");
    }
    event.preventDefault();
});
// render of task 
const renderTask = (task) => {
    const list_item = document.createElement('li');
    list_item.setAttribute('class', 'todo-item');
    renderDiv(list_item, task.text, task.id);
    list.append(list_item);
};
// render a div for task text ( delete button for deleting div inside)
function renderDiv(list_item, text, id) {
    const div = list_item.appendChild(document.createElement('div'));
    div.setAttribute('class', 'todo');
    div.innerHTML = text;
    div.classList.add('todo', `${savedTheme}-todo`);
    const deleted = div.appendChild(document.createElement('button'));
    // deleted.classList.add('delete-btn', `${savedTheme}-button`);
    deleted.setAttribute('class', 'bi bi-trash');
    // deleted.innerHTML = '<span class="bi bi-trash fa-sm" style="font-size:1rem; text-align:center"></span>'
    deleted.addEventListener('click', event => {
        todos.removeTask(id)
            .then((id) => {
            list_item.removeChild(div);
        }).catch(error => {
            alert(error);
        });
    });
}
// render a link for deleting tasks
const renderLink = (list_item, id) => {
    const link = list_item.appendChild(document.createElement('a'));
    link.innerHTML = '<i class ="bi bi-trash>Delete</i>';
    // link.setAttribute('style', 'float: centre')
    link.addEventListener('click', event => {
        todos.removeTask(id).then((id) => {
            const removeElement = document.querySelector(`[data-key=${id}]`);
            if (removeElement) {
                list.removeChild(removeElement);
            }
        }).catch(error => {
            alert(error);
        });
    });
};
// Change theme function:
function changeTheme(color) {
    localStorage.setItem('savedTheme', color);
    savedTheme = localStorage.getItem('savedTheme');
    document.body.className = color;
    // Change blinking cursor for darker theme:
    color === 'dark' ?
        document.getElementById('title').classList.add('darker-title')
        : document.getElementById('title').classList.remove('darker-title');
    document.getElementById('todo-input').className = `${color}-input`;
    // Change todo color without changing their status (completed or not):
    document.querySelectorAll('#todo').forEach(todo => {
        Array.from(todo.classList).some(item => item === 'completed') ?
            todo.className = `todo ${color}-todo completed`
            : todo.className = `todo ${color}-todo`;
    });
    // Change buttons color according to their type (todo, check or delete):
    document.querySelectorAll('button').forEach(button => {
        Array.from(button.classList).some(item => {
            if (item === 'check-btn') {
                button.className = `check-btn ${color}-button`;
            }
            else if (item === 'delete-btn') {
                button.className = `delete-btn ${color}-button`;
            }
            else if (item === 'todo-btn') {
                button.className = `todo-btn ${color}-button`;
            }
        });
    });
}
