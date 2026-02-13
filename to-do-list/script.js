const defaultTasks = [
    { id: 1, text: 'Eat', completed: false },
    { id: 2, text: 'Sleep', completed: true },
    { id: 3, text: 'Work', completed: false }
]

const STORAGE_KEY = 'tasks';
let tasks = []
let currentFilter = 'all';

const initTasks = () => {
    const data = localStorage.getItem(STORAGE_KEY);
    tasks = data ? JSON.parse(data) : [...defaultTasks];
}


// const getTasks = () => {
//     const data = localStorage.getItem(STORAGE_KEY);
//     if (data) {
//         return JSON.parse(data);
//     }

//     return defaultTasks;
    
// }


const saveTasks = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

const addingTask = () => {
    const input = document.querySelector('.task-input input[type="text"]');
    const text = input.value.trim();
    if (!text) return;

    tasks.push({
        id: Date.now() + Math.random(),
        text,
        completed: false
    });

    saveTasks();
    renderTasks();
    input.value = '';
};

const renderTasks = () => {
    const taskList = document.querySelector('.tasklist ul');
    taskList.innerHTML = '';

    const filteredTasks = getFilteredTasks();

    filteredTasks.forEach(task => {
        const li = document.createElement('li');

        const toggleCompleteBtn = document.createElement('button');
        const toggleCompleteImg = document.createElement('img');
        toggleCompleteImg.src = task.completed ? './images/check.png' : './images/unchecked.png';
        toggleCompleteImg.alt = "Complete";

        toggleCompleteBtn.appendChild(toggleCompleteImg);

        toggleCompleteBtn.addEventListener('click', () => {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
        });

        const span = document.createElement('span');
        span.textContent = task.text;
        if (task.completed) {
            span.classList.add('completed');
        };
        const deleteBtn = document.createElement('button');
        const deleteImg = document.createElement('img');
        deleteImg.src = './images/delete.png';
        deleteImg.alt = 'Delete';

        deleteBtn.appendChild(deleteImg);

        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();

            tasks = tasks.filter(t => t.id !== task.id);
            saveTasks();
            renderTasks();
        });

        li.appendChild(toggleCompleteBtn);
        li.appendChild(span);
        li.appendChild(deleteBtn);

        taskList.appendChild(li);
    });
};

const getFilteredTasks = () => {
    if (currentFilter === 'completed') {
        return tasks.filter(t => t.completed);
    }
    if (currentFilter === 'undone') {
        return tasks.filter(t => !t.completed);
    }
    return tasks;
}

const filterButtons = document.querySelectorAll('.tasklist-options input');

filterButtons[0].addEventListener('click', () => {
    currentFilter = 'all';
    renderTasks();
});

filterButtons[1].addEventListener('click', () => {
    currentFilter = 'completed';
    renderTasks();
});

filterButtons[2].addEventListener('click', () => {
    currentFilter = 'undone';
    renderTasks();
});

filterButtons[3].addEventListener('click', () => {
    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    renderTasks();
})

document.addEventListener('DOMContentLoaded', () => {
    initTasks();
    renderTasks();
});