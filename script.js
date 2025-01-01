document.addEventListener('DOMContentLoaded', function() {
    // Registration Logic
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userPassword', password);
            alert('Registration successful! You can now login.');
            window.location.href = 'login.html';
        });
    }

    // Login Logic
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            if (email === localStorage.getItem('userEmail') && password === localStorage.getItem('userPassword')) {
                alert('Login successful!');
                window.location.href = 'home.html'; // Redirect to homepage
            } else {
                alert('Invalid email or password. Please try again.');
            }
        });
    }

    // Poll Creation Logic
    const pollForm = document.getElementById('pollForm');
    if (pollForm) {
        pollForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const question = document.getElementById('pollQuestion').value;
            const options = document.getElementById('pollOptions').value.split(',');
            const polls = JSON.parse(localStorage.getItem('polls')) || [];
            polls.push({ question, options: options.map(option => option.trim()), votes: Array(options.length).fill(0) });
            localStorage.setItem('polls', JSON.stringify(polls));
            alert('Poll created successfully!');
            pollForm.reset();
        });
    }

    // Voting Logic
    const voteForm = document.getElementById('voteForm');
    if (voteForm) {
        voteForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const selectedPollIndex = document.getElementById('pollSelect').value;
            const selectedOptionIndex = document.querySelector('input[name="pollOption"]:checked')?.value;
            if (selectedOptionIndex !== undefined) {
                const polls = JSON.parse(localStorage.getItem('polls'));
                polls[selectedPollIndex].votes[selectedOptionIndex]++;
                localStorage.setItem('polls', JSON.stringify(polls));
                alert('Vote submitted successfully!');
            } else {
                alert('Please select an option to vote.');
            }
        });
    }

    // Load Polls for Voting
    const pollSelect = document.getElementById('pollSelect');
    if (pollSelect) {
        const polls = JSON.parse(localStorage.getItem('polls')) || [];
        polls.forEach((poll, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = poll.question;
            pollSelect.appendChild(option);
        });

        pollSelect.addEventListener('change', function() {
            const selectedPoll = polls[this.value];
            const optionsContainer = document.getElementById('optionsContainer');
            optionsContainer.innerHTML = '';
            selectedPoll.options.forEach((option, index) => {
                const optionHtml = `<div class="form-check">
                    <input class="form-check-input" type="radio" name="pollOption" value="${index}" required>
                    <label class="form-check-label">${option}</label>
                </div>`;
                optionsContainer.innerHTML += optionHtml;
            });
        });
    }

    // Display Results
    window.onload = function() {
        const resultsDiv = document.getElementById('results');
        const polls = JSON.parse(localStorage.getItem('polls')) || [];

        if (polls.length === 0) {
            resultsDiv.innerHTML = '<p>No polls available.</p>';
            return;
        }

        polls.forEach((poll, index) => {
            const pollCard = document.createElement('div');
            pollCard.className = 'result-card';
            pollCard.innerHTML = `<h3>${poll.question}</h3>`;
            
            poll.options.forEach((option, optionIndex) => {
                const votes = poll.votes[optionIndex] || 0;
                pollCard.innerHTML += `<div class="result-option">${option}: ${votes} votes</div>`;
            });

            resultsDiv.appendChild(pollCard);
        });
    };
});