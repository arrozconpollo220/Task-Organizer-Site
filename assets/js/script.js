// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
    if (!nextId) {
        nextId = 1;
    }
    let taskId = nextId;
    nextId++; 
    localStorage.setItem("nextId", JSON.stringify(nextId));
    return taskId; 
    }

// Todo: create a function to create a task card
function createTaskCard(task) {
 
    let taskCard = document.createElement('div');
    
    taskCard.setAttribute('data-id', task.id);
    taskCard.className = 'card mb-2';
    let today = new Date();
    let dueDate = new Date(task.dueDate);
    let overDueD = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));

    let colorClass = '';
    if (overDueD > 0) {
        colorClass = 'bg-danger text-white'; 
    } else if (overDueD >= -2) {
        colorClass = 'bg-warning text-dark';
    } else {
        colorClass = 'bg-light'; 
    }
    taskCard.innerHTML = `
        <div class="card-body ${colorClass}">
            <h5 class="card-title">${task.name}</h5>
            <p class="card-text">${task.description}</p>
            <p class="card-text"><small class="text-muted">Due: ${task.dueDate}</small></p>
        </div>
    `;
    //delete button function
    let delButton = document.createElement('button');
    delButton.type = 'button';
    delButton.className = 'btn btn-danger delete-task';
    delButton.textContent = 'Delete';
    delButton.addEventListener('click', function(event) {
        handleDeleteTask(event, task.id);
        event.stopPropagation();
    });
    taskCard.querySelector('.card-body').appendChild(delButton);

    taskCard.setAttribute('data-status', task.status);
    
    return taskCard;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {

    document.getElementById('todo-cards').innerHTML = '';
    taskList.forEach(task => {
        let taskCard = createTaskCard(task);
        document.getElementById('todo-cards').appendChild(taskCard);
        taskCard.setAttribute('data-status', task.status);
    });

    $(".card").draggable({
        handle: ".card-body",
        revert: "invalid",
        stack: ".card",
        cursor: "move",
        helper: "clone"
    });

     $(".column").droppable({
        drop: handleDrop
    });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();

    let taskNme = document.getElementById('taskNme').value;
    let taskDescription = document.getElementById('taskDescription').value;
    let tskDueDte = document.getElementById('tskDueDte').value;

    let newTask = {
        id: generateTaskId(),
        name: taskNme,
        description: taskDescription,
        dueDate: tskDueDte,
        status: "to-do"
    };

    taskList.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();

    document.getElementById('taskForm').reset();

    $('#formModal').modal('hide');
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    console.log("Handle Delete Task function is called");
    console.log("Event target:", event.target);

        if (event.target.classList.contains('delete-task')) {
      
        let taskCard = event.target.closest('.card');

        let taskId = parseInt(taskCard.getAttribute('data-id'));

        taskList = taskList.filter(task => task.id !== taskId);

        localStorage.setItem("tasks", JSON.stringify(taskList));

        $(document).ready(function() {
        
            $('.delete-task').click(handleDeleteTask);
        });

        renderTaskList();
    }
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

 let taskId = parseInt(ui.draggable.attr('data-id'));
 let newStatus = event.target.getAttribute('data-status');
 
 let taskIndex = taskList.findIndex(task => task.id === taskId);
 if (taskIndex !== -1) {
     taskList[taskIndex].status = newStatus;

     ui.draggable.remove();

     $(event.target).find('.card-body').append(ui.draggable);

     localStorage.setItem("tasks", JSON.stringify(taskList));
 }
}

$(document).ready(function () {

 renderTaskList();

 $(".lane").droppable({
     accept: ".card",
     drop: handleDrop
 });
});

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    taskList = taskList || []; 
    nextId = nextId || 1;

    renderTaskList();

    document.getElementById('taskForm').addEventListener('submit', handleAddTask);
    document.getElementById('todo-cards').addEventListener('click', handleDeleteTask);

    $(".lane").droppable({
        accept: ".card",
        drop: handleDrop
    });

    $("#tskDueDte").datepicker();
});
