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
