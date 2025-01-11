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
        suggestionBox.style.top = `${rect.top + rect.height + 5}px`; // Position below the input field
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
