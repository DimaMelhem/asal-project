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
