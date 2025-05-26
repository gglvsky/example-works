let taskList = {
    tasks: JSON.parse(localStorage.getItem('tasks')) || [],
};

const saveTasksToStorage = () => {
    localStorage.setItem('tasks', JSON.stringify(taskList.tasks));
};

const renderTasks = (tasksToRender) => {
    const taskListElement = document.getElementById('taskList');
    taskListElement.innerHTML = '';

    tasksToRender.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = task.status === 'done' ? 'completed-task' : '';
        li.setAttribute('draggable', 'true');
        li.setAttribute('data-id', task.id);
        li.ondragstart = dragStart;
        li.ondragover = dragOver;
        li.ondrop = drop;

        const doneBtn = document.createElement('input');
        doneBtn.type = 'button';
        doneBtn.className = 'done';
        doneBtn.onclick = () => toggleTaskStatus(task.id);

        const p = document.createElement('p');
        if (task.status === 'done') {
            const s = document.createElement('s');
            s.innerText = task.text;
            p.appendChild(s);
        } else {
            p.innerText = task.text;
        }

        const deleteBtn = document.createElement('input');
        deleteBtn.type = 'button';
        deleteBtn.className = 'delete';
        deleteBtn.onclick = () => deleteTask(task.id);

        li.appendChild(doneBtn);
        li.appendChild(p);
        li.appendChild(deleteBtn);
        li.ondragstart = dragStart;
        li.ondragover = dragOver;
        li.ondrop = drop;
        li.ondragenter = dragEnter;
        li.ondragleave = dragLeave;
        li.ondragend = dragEnd;

        taskListElement.appendChild(li);
    });

    updateItemsLeft();
};


const updateItemsLeft = () => {
    const itemsLeft = taskList.tasks.filter(task => task.status === 'in-progress').length;
    document.getElementById('itemsLeft').innerText = `${itemsLeft} items left`;
};

const addingTask = () => {
    const input = document.getElementById('taskEnterField');
    const text = input.value.trim();
    if (!text) return;

    const newTask = {
        id: Date.now(),
        text,
        status: 'in-progress',
    };

    taskList.tasks.push(newTask);
    saveTasksToStorage();
    renderTasks(taskList.tasks);
    input.value = '';
};

const toggleTaskStatus = (taskId) => {
    const task = taskList.tasks.find(t => t.id === taskId);
    if (task) {
        task.status = task.status === 'done' ? 'in-progress' : 'done';
        saveTasksToStorage();
        renderTasks(taskList.tasks);
    }
};

const deleteTask = (taskId) => {
    taskList.tasks = taskList.tasks.filter(t => t.id !== taskId);
    saveTasksToStorage();
    renderTasks(taskList.tasks);
};

const filterTasks = (filterType) => {
    let filteredTasks = [];

    switch (filterType) {
        case 'all':
            filteredTasks = taskList.tasks;
            break;
        case 'active':
            filteredTasks = taskList.tasks.filter(task => task.status === 'in-progress');
            break;
        case 'completed':
            filteredTasks = taskList.tasks.filter(task => task.status === 'done');
            break;
        case 'clearCompleted':
            taskList.tasks = taskList.tasks.filter(task => task.status !== 'done');
            saveTasksToStorage();
            filteredTasks = taskList.tasks;
            break;
        default:
            filteredTasks = taskList.tasks;
    }

    setActiveFilter(filterType);
    renderTasks(filteredTasks);
};

const setActiveFilter = (filter) => {
    document.querySelectorAll('.task-options li input').forEach(btn => {
        btn.classList.remove('active-filter');
        if (btn.value.toLowerCase() === filter) {
            btn.classList.add('active-filter');
        }
    });
};

let draggedItemId = null;

const dragStart = (e) => {
    draggedItemId = e.currentTarget.getAttribute('data-id');
    e.currentTarget.classList.add('dragging');
};

const dragEnter = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
};

const dragOver = (e) => {
    e.preventDefault();
};

const dragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over');
};

const drop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');

    const targetId = e.currentTarget.getAttribute('data-id');
    if (draggedItemId === targetId) return;

    const draggedIndex = taskList.tasks.findIndex(t => t.id == draggedItemId);
    const targetIndex = taskList.tasks.findIndex(t => t.id == targetId);

    const [draggedTask] = taskList.tasks.splice(draggedIndex, 1);
    taskList.tasks.splice(targetIndex, 0, draggedTask);

    saveTasksToStorage();
    renderTasks(taskList.tasks);
};

const dragEnd = (e) => {
    e.currentTarget.classList.remove('dragging');
};

document.getElementById('taskEnterField').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        addingTask();
    }
});


document.getElementById('toggleTheme').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

renderTasks(taskList.tasks);
