// Quiz questions array
const questions = [
    {
        question: "Which keyword is used to declare a variable in JavaScript?",
        options: ["var", "define", "new", "const"],
        answer: "var"
    },
    {
        question: "What does DOM stand for?",
        options: ["Document Object Model", "Data Object Model", "Display Object Management", "Document Oriented Mode"],
        answer: "Document Object Model"
    },
    {
        question: "Which method is used to add an element to the end of an array?",
        options: ["push()", "append()", "add()", "insert()"],
        answer: "push()"
    },
    {
        question: "What is the correct way to write a JavaScript array?",
        options: [
            "var colors = (1:'red', 2:'green', 3:'blue')",
            "var colors = ['red', 'green', 'blue']",
            "var colors = 'red', 'green', 'blue'",
            "var colors = {1:'red', 2:'green', 3:'blue'}"
        ],
        answer: "var colors = ['red', 'green', 'blue']"
    },
    {
        question: "Which operator is used to assign a value to a variable?",
        options: ["=", "==", "===", "=>"],
        answer: "="
    },
    {
        question: "What is the correct way to write a JavaScript function?",
        options: [
            "function myFunction()",
            "function:myFunction()",
            "function = myFunction()",
            "function => myFunction()"
        ],
        answer: "function myFunction()"
    },
    {
        question: "Which event occurs when the user clicks on an HTML element?",
        options: ["onchange", "onclick", "onmouseover", "onmouseclick"],
        answer: "onclick"
    },
    {
        question: "How do you create a function in JavaScript?",
        options: [
            "function myFunction()",
            "function:myFunction()",
            "function = myFunction()",
            "function => myFunction()"
        ],
        answer: "function myFunction()"
    },
    {
        question: "How do you call a function named 'myFunction'?",
        options: [
            "call myFunction()",
            "myFunction()",
            "call function myFunction()",
            "function myFunction()"
        ],
        answer: "myFunction()"
    },
    {
        question: "How to write an IF statement in JavaScript?",
        options: [
            "if (i == 5)",
            "if i = 5 then",
            "if i == 5 then",
            "if i = 5"
        ],
        answer: "if (i == 5)"
    },
    {
        question: "Which method is used to remove the last element from an array?",
        options: ["pop()", "remove()", "delete()", "splice()"],
        answer: "pop()"
    },
    {
        question: "What is the correct way to create a JavaScript object?",
        options: [
            "var person = {firstName: 'John', lastName: 'Doe'}",
            "var person = [firstName: 'John', lastName: 'Doe']",
            "var person = (firstName: 'John', lastName: 'Doe')",
            "var person = 'firstName: John, lastName: Doe'"
        ],
        answer: "var person = {firstName: 'John', lastName: 'Doe'}"
    },
    {
        question: "Which method is used to convert a string to an integer?",
        options: ["parseInt()", "parseFloat()", "Number()", "Integer()"],
        answer: "parseInt()"
    },
    {
        question: "What is the correct way to write a JavaScript comment?",
        options: [
            "// This is a comment",
            "<!-- This is a comment -->",
            "/* This is a comment",
            "** This is a comment **"
        ],
        answer: "// This is a comment"
    },
    {
        question: "Which method is used to find the length of a string?",
        options: ["length()", "size()", "count()", "length"],
        answer: "length"
    }
];

// DOM Elements
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const questionNumber = document.getElementById('question-number');
const timerElement = document.getElementById('timer');
const progressBar = document.querySelector('.progress-bar');
const scoreElement = document.getElementById('score');
const totalQuestionsElement = document.getElementById('total-questions');
const percentageElement = document.getElementById('percentage');
const highScoreElement = document.getElementById('high-score');
const themeToggle = document.querySelector('.theme-toggle');

// Quiz state
let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 15;
let shuffledQuestions = [];
let mmr = 1000; // Starting MMR
let totalTimeTaken = 0; // Track total time taken for all questions

// MMR calculation constants
const BASE_MMR_CHANGE = 25;
const TIME_PENALTY_FACTOR = 0.5;
const PERFECT_SCORE_BONUS = 50;

// Theme toggle
themeToggle.addEventListener('click', () => {
    document.body.dataset.theme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
    themeToggle.innerHTML = document.body.dataset.theme === 'dark' ? 
        '<i class="fas fa-sun"></i>' : 
        '<i class="fas fa-moon"></i>';
});

// Start Quiz
startBtn.addEventListener('click', startQuiz);
restartBtn.addEventListener('click', startQuiz);

function startQuiz() {
    currentQuestion = 0;
    score = 0;
    totalTimeTaken = 0;
    shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);
    
    startScreen.classList.add('hidden');
    resultScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    
    // Load MMR from localStorage
    mmr = parseInt(localStorage.getItem('mmr')) || 1000;
    
    showQuestion();
    startTimer();
}

function showQuestion() {
    const question = shuffledQuestions[currentQuestion];
    questionText.textContent = question.question;
    optionsContainer.innerHTML = '';
    
    question.options.forEach(option => {
        const button = document.createElement('div');
        button.className = 'option';
        button.textContent = option;
        button.addEventListener('click', () => selectAnswer(option));
        optionsContainer.appendChild(button);
    });
    
    questionNumber.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
    progressBar.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
    
    nextBtn.classList.add('hidden');
    timeLeft = 15;
    timerElement.textContent = timeLeft;
}

function selectAnswer(selectedOption) {
    clearInterval(timer);
    const options = optionsContainer.children;
    const correctAnswer = shuffledQuestions[currentQuestion].answer;
    
    // Calculate time taken for this question
    const timeTaken = 15 - timeLeft;
    totalTimeTaken += timeTaken;
    
    for (let option of options) {
        option.classList.remove('selected', 'correct', 'wrong');
        if (option.textContent === correctAnswer) {
            option.classList.add('correct');
        }
        if (option.textContent === selectedOption && selectedOption !== correctAnswer) {
            option.classList.add('wrong');
        }
    }
    
    if (selectedOption === correctAnswer) {
        score++;
    }
    
    nextBtn.classList.remove('hidden');
}

function startTimer() {
    clearInterval(timer);
    timeLeft = 15;
    timerElement.textContent = timeLeft;
    
    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            selectAnswer(null);
        }
    }, 1000);
}

nextBtn.addEventListener('click', () => {
    currentQuestion++;
    
    if (currentQuestion < questions.length) {
        showQuestion();
        startTimer();
    } else {
        showResults();
    }
});

function showResults() {
    quizScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    
    const percentage = Math.round((score / questions.length) * 100);
    scoreElement.textContent = score;
    totalQuestionsElement.textContent = questions.length;
    percentageElement.textContent = percentage;
    
    // Calculate MMR change
    const averageTimePerQuestion = totalTimeTaken / questions.length;
    const timePenalty = Math.max(0, averageTimePerQuestion - 5) * TIME_PENALTY_FACTOR;
    let mmrChange = BASE_MMR_CHANGE * (score / questions.length) - timePenalty;
    
    // Add bonus for perfect score
    if (score === questions.length) {
        mmrChange += PERFECT_SCORE_BONUS;
    }
    
    // Update MMR
    mmr = Math.max(0, Math.round(mmr + mmrChange));
    localStorage.setItem('mmr', mmr);
    
    // Update high score
    const highScore = localStorage.getItem('highScore') || 0;
    if (percentage > highScore) {
        localStorage.setItem('highScore', percentage);
        highScoreElement.textContent = percentage;
    } else {
        highScoreElement.textContent = highScore;
    }
    
    // Add MMR display to result screen
    const mmrElement = document.createElement('p');
    mmrElement.innerHTML = `MMR: <span id="mmr">${mmr}</span>`;
    mmrElement.className = 'mmr-display';
    document.querySelector('.score-container').appendChild(mmrElement);
}

// Initialize high score
highScoreElement.textContent = localStorage.getItem('highScore') || 0; 