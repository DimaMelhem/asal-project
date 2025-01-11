document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('todoInput');
    const suggestionBox = document.getElementById('suggestionBox');
    const addTaskButton = document.querySelector('.button_addnewtask');

    // Load task names from localStorage
    const taskNames = JSON.parse(localStorage.getItem('taskNames')) || [];

    // Set global font family to Arial, sans-serif
    document.body.style.fontFamily = 'Arial, sans-serif';

    // Render suggestions based on input value
    const renderSuggestions = () => {
        suggestionBox.innerHTML = '';
        const inputValue = taskInput.value.toLowerCase();

        // Filter suggestions that match the input value
        const matchingNames = taskNames.filter(name => name.toLowerCase().includes(inputValue));

        // Display matching suggestions
        matchingNames.forEach(name => {
            const suggestion = document.createElement('div');
            suggestion.classList.add('suggestionItem');
            suggestion.textContent = name;
            suggestion.addEventListener('click', () => {
                taskInput.value = name;
                suggestionBox.style.display = 'none';
            });
            suggestionBox.appendChild(suggestion);
        });

          // Show the suggestion box if there are matching names
          suggestionBox.style.display = matchingNames.length > 0 ? 'block' : 'none';

          // Position the suggestion box near the input field
          const rect = taskInput.getBoundingClientRect();
          suggestionBox.style.left = `${rect.left + rect.width * 0.1}px`;
          suggestionBox.style.top = `${rect.top + rect.height + 0.1}px`; // Position below the input field
      };
     // Show suggestions when the input field is focused
     taskInput.addEventListener('focus', () => {
        if (taskNames.length > 0) {
            renderSuggestions();
        }
    });
    // Hide suggestions when the input field loses focus
    taskInput.addEventListener('blur', () => {
        setTimeout(() => {
            suggestionBox.style.display = 'none';
        }, 200); // Delay to allow clicking on a suggestion
    });

    // Add new task when clicking the add task button
    addTaskButton.addEventListener('click', () => {
        const taskInputValue = taskInput.value;

        // Validate input
        let errorMessage = getErrorMessage(taskInputValue);
        if (errorMessage) {
            displayError('taskInputError', errorMessage);
            return;
        }
        // Add task to the list
        addTask(taskInputValue);

        // Save task name in localStorage if not already present
        if (!taskNames.includes(taskInputValue)) {
            taskNames.push(taskInputValue);
            localStorage.setItem('taskNames', JSON.stringify(taskNames));
        }

        // Clear input and any error messages
        taskInput.value = '';
        clearError('taskInputError');
    });

    // Add event listener for deleting done tasks
    const deleteDoneTasksButton = document.querySelector('.button_delete_done_tasks');
    deleteDoneTasksButton.addEventListener('click', () => {
        const tasks = document.querySelectorAll('.taskItem');
        tasks.forEach(task => {
            const checkbox = task.querySelector('.checkbox-green');
            if (checkbox.checked) {
                task.remove();
            }
        });
    });

    document.querySelectorAll('.button_under_todolist').forEach(button => {
        button.addEventListener('click', (event) => {
            const filter = event.target.innerText.toLowerCase();
            filterTasks(filter);
            document.querySelectorAll('.button_under_todolist').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });

    const deleteAllTasksButton = document.querySelector('.button_delete_all_tasks');
    deleteAllTasksButton.addEventListener('click', () => {
        showDeleteAllConfirmDialog();
    });
});

// Function to display error message
const displayError = (elementId, message) => {
    let errorElement = document.getElementById(elementId);
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.id = elementId;
        errorElement.style.marginTop = '0.5rem';
        
        const inputElement = document.getElementById('todoInput');
        inputElement.parentNode.appendChild(errorElement);
    }
    errorElement.innerText = message;
    errorElement.style.color = 'red';
    errorElement.style.fontSize = '0.8rem';
    errorElement.style.fontFamily = 'Arial, sans-serif';
    errorElement.style.marginLeft = '1rem';
    errorElement.style.marginTop = '0.4rem';
    
};

// Function to clear error message
const clearError = (elementId) => {
    let errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.innerText = '';
    }
};

// Function to validate task input
const getErrorMessage = (task) => {
    if (!task || task.trim() === '') {
        return 'Task cannot be empty.';
    }
    if (/^\d/.test(task)) {
        return 'Task cannot start with a number.';
    }
    if (task.trim().length < 5) {
        return 'Task must be at least 5 characters long.';
    }
    return null;
};

// Function to add task to the list
const addTask = (task) => {
    const taskList = document.getElementById('taskList');
    
    const taskItem = document.createElement('div');
    taskItem.classList.add('taskItem');

    const taskText = document.createElement('span');
    taskText.classList.add('taskText');
    taskText.innerText = task;

    // Create icons (trash, edit, checkbox)
    const taskIcons = document.createElement('div');
    taskIcons.classList.add('taskIcons');

    const trashIcon = document.createElement('i');
    trashIcon.classList.add('fas', 'fa-trash');
    trashIcon.style.color = 'red';
    trashIcon.style.marginLeft = '10px';
    trashIcon.addEventListener('click', () => {
        displayConfirm('Are you sure you want to delete this task?', () => {
            taskItem.remove();
        });
    });

    const editIcon = document.createElement('i');
    editIcon.classList.add('fas', 'fa-pen');
    editIcon.style.color = 'yellow';
    editIcon.style.marginLeft = '10px';
    editIcon.addEventListener('click', () => {
        displayPrompt('Rename Task', taskText.innerText, (newTaskName) => {
            const errorMessage = getErrorMessage(newTaskName); // Validate input
            if (errorMessage) {
                displayError('editTaskError', errorMessage); // Show error if invalid
            } else {
                taskText.innerText = newTaskName; // Update task if valid
                clearError('editTaskError'); // Clear error
            }
        });
    });

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('checkbox-green');
    checkbox.style.marginLeft = '10px';
    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            taskText.style.color = 'red';
            taskText.style.textDecoration = 'line-through';
        } else {
            taskText.style.color = 'black';
            taskText.style.textDecoration = 'none';
        }
    });

    taskIcons.appendChild(checkbox);
    taskIcons.appendChild(editIcon);
    taskIcons.appendChild(trashIcon);

    taskItem.appendChild(taskText);
    taskItem.appendChild(taskIcons);

    taskList.appendChild(taskItem);
};

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
