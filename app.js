// Function to filter tasks by status (all, done, todo)
const filterTasks = (filter) => { 
    const tasks = document.querySelectorAll('.taskItem'); 
    tasks.forEach(task => { 
        const checkbox = task.querySelector('.checkbox-green'); 
        if (filter === 'all') { 
            task.style.display = 'flex'; 
        } else if (filter === 'done') { 
            if (checkbox.checked) { 
                task.style.display = 'flex'; 
            } else { 
                task.style.display = 'none'; 
            } 
        } else if (filter === 'todo') { 
            if (!checkbox.checked) { 
                task.style.display = 'flex'; 
            } else { 
                task.style.display = 'none'; 
            } 
        } 
    }); 
};

// Function to display error message below a specific input field
const displayErrorBelowInput = (inputElement, elementId, message) => {
    let errorElement = document.getElementById(elementId);
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.id = elementId;

        // Insert the error message directly after the input field
        inputElement.parentNode.insertBefore(errorElement, inputElement.nextSibling);
    }
    errorElement.innerText = message;
    errorElement.style.color = 'red';
    errorElement.style.fontSize = '0.8rem';
    errorElement.style.fontFamily = 'Arial, sans-serif';
    errorElement.style.marginLeft = '-5rem';
    errorElement.style.marginTop='-0.5rem';
};

// Function to clear error message
const clearErrorBelowInput = (elementId) => {
    let errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.innerText = '';
    }
};

// Function to display a prompt dialog for task renaming
const displayPrompt = (message, currentValue, callback) => {
    const promptDialog = document.createElement('div');
    promptDialog.classList.add('custom-prompt');

    const promptMessage = document.createElement('p');
    promptMessage.textContent = 'Rename Task';
    promptMessage.style.fontWeight = 'bold';
    promptMessage.style.fontSize = '1.2rem';
    promptMessage.style.fontFamily = 'Arial, sans-serif';
    promptDialog.appendChild(promptMessage);

    const input = document.createElement('input');
    input.value = currentValue;
    promptDialog.appendChild(input);

    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('prompt-buttons');

    const saveButton = document.createElement('button');
    saveButton.classList.add('btn-save');
    saveButton.textContent = 'Save';
    saveButton.addEventListener('click', () => {
        // Validate input before saving
        const errorMessage = getErrorMessage(input.value);
        if (errorMessage) {
            displayErrorBelowInput(input, 'renameTaskError', errorMessage); // Show error below input
            return;
        }
        clearErrorBelowInput('renameTaskError'); // Clear any existing errors
        callback(input.value); // Save new task name
        document.body.removeChild(promptDialog);
    });
    buttonsContainer.appendChild(saveButton);

    const cancelButton = document.createElement('button');
    cancelButton.classList.add('btn-cancel');
    cancelButton.textContent = 'Cancel';
    cancelButton.addEventListener('click', () => {
        document.body.removeChild(promptDialog);
    });
    buttonsContainer.appendChild(cancelButton);

    promptDialog.appendChild(buttonsContainer);
    document.body.appendChild(promptDialog);
};


// 
const deleteDoneTasksButton = document.querySelector('.button_delete_done_tasks');

deleteDoneTasksButton.addEventListener('click', () => {
    showConfirmDialog();
});

function showConfirmDialog() {
    const confirmDialog = document.createElement('div');
    confirmDialog.classList.add('custom-confirm');
    
    const header = document.createElement('h2'); 
header.textContent = 'Delete Done Tasks'; 
confirmDialog.appendChild(header);

const message = document.createElement('p');
message.textContent = 'Are you sure you want to delete all completed tasks?';
confirmDialog.appendChild(message);

const buttonsContainer = document.createElement('div');
buttonsContainer.classList.add('confirm-buttons');

const confirmButton = document.createElement('button');
confirmButton.classList.add('btn-confirm');
confirmButton.textContent = 'Confirm';
confirmButton.addEventListener('click', () => {
    deleteCompletedTasks();
    document.body.removeChild(confirmDialog);
});
buttonsContainer.appendChild(confirmButton);

const cancelButton = document.createElement('button');
cancelButton.classList.add('btn-cancel');
cancelButton.textContent = 'Cancel';
cancelButton.addEventListener('click', () => {
    document.body.removeChild(confirmDialog);
});
buttonsContainer.appendChild(cancelButton);

confirmDialog.appendChild(buttonsContainer);
document.body.appendChild(confirmDialog);
}

function deleteCompletedTasks() {
const tasks = document.querySelectorAll('.taskItem');
tasks.forEach(task => {
    const checkbox = task.querySelector('input[type="checkbox"]');
    if (checkbox && checkbox.checked) {
        task.remove();
    }
});
}

// Function to display a confirmation dialog
const displayConfirm = (message, onConfirm) => {
    const confirmDialog = document.createElement('div');
    confirmDialog.classList.add('custom-confirm');
    const header = document.createElement('h2');
    header.textContent = 'Delete Task';
    confirmDialog.appendChild(header);

    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    confirmDialog.appendChild(messageElement);

    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('confirm-buttons');

    const confirmButton = document.createElement('button');
    confirmButton.classList.add('btn-confirm');
    confirmButton.textContent = 'Confirm';
    confirmButton.addEventListener('click', () => {
        onConfirm();
        document.body.removeChild(confirmDialog);
    });
    buttonsContainer.appendChild(confirmButton);

    const cancelButton = document.createElement('button');
    cancelButton.classList.add('btn-cancel');
    cancelButton.textContent = 'Cancel';
    cancelButton.addEventListener('click', () => {
        document.body.removeChild(confirmDialog);
    });
    buttonsContainer.appendChild(cancelButton);

    confirmDialog.appendChild(buttonsContainer);
    document.body.appendChild(confirmDialog);
};

// Function to show delete all confirm dialog
const showDeleteAllConfirmDialog = () => {
    displayConfirm('Are you sure you want to delete all tasks?', () => {
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = ''; // Clear all tasks
    });
};
