// Reverse Google Game Logic

class ReverseGoogleGame {
    constructor() {
        this.currentRound = 1;
        this.totalRounds = 8;
        this.score = 0;
        this.gameActive = false;
        this.timer = null;
        this.timeElapsed = 0;
        
        // Predefined clues and answers
        // this.clues = [
        //     { clue: "round fruit doctor hates", answer: "apple", alternatives: ["apples"] },
        //     { clue: "frozen water white stuff", answer: "snow", alternatives: ["ice"] },
        //     { clue: "yellow curved monkey food", answer: "banana", alternatives: ["bananas"] },
        //     { clue: "king of jungle mane", answer: "lion", alternatives: ["lions"] },
        //     { clue: "black and white stripe animal", answer: "zebra", alternatives: ["zebras"] },
        //     { clue: "mans best friend woof", answer: "dog", alternatives: ["dogs", "puppy"] },
        //     { clue: "red fire truck color", answer: "red", alternatives: [] },
        //     { clue: "sky color clear day", answer: "blue", alternatives: [] },
        //     { clue: "hot yellow star", answer: "sun", alternatives: [] },
        //     { clue: "night light white circle", answer: "moon", alternatives: [] },
        //     { clue: "green money paper", answer: "dollar", alternatives: ["money", "cash"] },
        //     { clue: "sweet brown candy bar", answer: "chocolate", alternatives: ["candy"] },
        //     { clue: "salty ocean water", answer: "sea", alternatives: ["ocean"] },
        //     { clue: "tall green leafy plant", answer: "tree", alternatives: ["trees"] },
        //     { clue: "flying metal machine", answer: "airplane", alternatives: ["plane", "aircraft"] },
        //     { clue: "four wheels drive machine", answer: "car", alternatives: ["automobile", "vehicle"] },
        //     { clue: "white cold frozen drink", answer: "milk", alternatives: [] },
        //     { clue: "brown hot morning drink", answer: "coffee", alternatives: [] },
        //     { clue: "sweet bee golden liquid", answer: "honey", alternatives: [] },
        //     { clue: "orange halloween vegetable", answer: "pumpkin", alternatives: ["pumpkins"] }
        // ];

        this.clues = [
            { clue: "cloud with no rain but data", answer: "cloud", alternatives: ["cloud computing"] },
            { clue: "round fruit doctor hates", answer: "apple", alternatives: ["apples"] },
            { clue: "tiny brainy chip inside computer", answer: "processor", alternatives: ["cpu"] },
            { clue: "night light white circle", answer: "moon", alternatives: [] },
            { clue: "penguin linux mascot", answer: "tux", alternatives: ["linux"] },

            { clue: "mans best friend woof", answer: "dog", alternatives: ["dogs", "puppy"] },
            { clue: "math shape with 3 sides", answer: "triangle", alternatives: [] },
            { clue: "robot friend vacuum cleaner", answer: "roomba", alternatives: [] },
            { clue: "hot yellow star", answer: "sun", alternatives: [] },
            { clue: "engineers best debugging tool", answer: "print", alternatives: ["console.log", "printf"] },

            { clue: "yellow curved monkey food", answer: "banana", alternatives: ["bananas"] },
            { clue: "famous red hat animal", answer: "fedora", alternatives: ["linux fedora"] },
            { clue: "404 page not found mascot", answer: "error", alternatives: ["404"] },
            { clue: "father of modern computers", answer: "turing", alternatives: ["alan turing"] },
            { clue: "tiny storage atom in ram", answer: "bit", alternatives: [] },

            { clue: "keyboard button for escape", answer: "esc", alternatives: ["escape"] },
            { clue: "developer fuel morning drink", answer: "coffee", alternatives: ["espresso", "latte"] },
            { clue: "number of bits in a byte", answer: "8", alternatives: ["eight"] },
            { clue: "cogwheel of software dev", answer: "algorithm", alternatives: [] },
            { clue: "language web browsers speak", answer: "javascript", alternatives: ["js"] }
        ];
        
        this.currentClues = [];
        this.currentQuestion = null;
    }
    
    init() {
        this.bindEvents();
        this.resetGame();
    }
    
    bindEvents() {
        // Submit button
        const submitBtn = document.querySelector('button[onclick="submitAnswer()"]');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => this.submitAnswer());
        }
        
        // Enter key in input
        const answerInput = document.getElementById('answer-input');
        if (answerInput) {
            answerInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && this.gameActive) {
                    this.submitAnswer();
                }
            });
        }
    }
    
    resetGame() {
        this.currentRound = 1;
        this.score = 0;
        this.gameActive = false;
        this.timeElapsed = 0;
        
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        this.updateUI();
        this.showInstructions();
    }
    
    startGame() {
        this.currentClues = window.MiniGames.shuffleArray(this.clues).slice(0, this.totalRounds);
        this.currentRound = 1;
        this.score = 0;
        this.gameActive = true;
        this.timeElapsed = 0;
        
        this.hideInstructions();
        this.showGamePlay();
        this.startTimer();
        this.loadNextQuestion();
        
        window.MiniGames.announceToScreenReader('Reverse Google game started');
    }
    
    startTimer() {
        this.timer = setInterval(() => {
            this.timeElapsed++;
            this.updateTimer();
        }, 1000);
    }
    
    updateTimer() {
        const timerElement = document.getElementById('timer');
        if (timerElement) {
            timerElement.textContent = window.MiniGames.formatTime(this.timeElapsed);
        }
    }
    
    loadNextQuestion() {
        if (this.currentRound <= this.totalRounds) {
            this.currentQuestion = this.clues[this.currentRound - 1];
            
            const clueElement = document.getElementById('clue-text');
            const answerInput = document.getElementById('answer-input');
            
            if (clueElement && this.currentQuestion) {
                clueElement.textContent = this.currentQuestion.clue;
                window.MiniGames.animateElement(clueElement, 'fade-in');
            }
            
            if (answerInput) {
                answerInput.value = '';
                answerInput.focus();
            }
            
            this.hideFeedback();
            this.updateUI();
        } else {
            this.endGame();
        }
    }
    
    submitAnswer() {
        if (!this.gameActive || !this.currentQuestion) return;
        
        const answerInput = document.getElementById('answer-input');
        if (!answerInput) return;
        
        const userAnswer = answerInput.value.trim().toLowerCase();
        if (!userAnswer) return;
        
        const correctAnswer = this.currentQuestion.answer.toLowerCase();
        const alternatives = this.currentQuestion.alternatives.map(alt => alt.toLowerCase());
        
        // Check if answer is correct (exact match or alternative)
        const isCorrect = userAnswer === correctAnswer || 
                         alternatives.includes(userAnswer) ||
                         correctAnswer.includes(userAnswer) ||
                         userAnswer.includes(correctAnswer);
        
        if (isCorrect) {
            this.score++;
            this.showFeedback(true, `Correct! The answer was "${this.currentQuestion.answer}"`);
            window.MiniGames.announceToScreenReader('Correct answer!');
        } else {
            this.showFeedback(false, `Incorrect. The answer was "${this.currentQuestion.answer}"`);
            window.MiniGames.announceToScreenReader('Incorrect answer');
        }
        
        this.updateUI();
    }
    
    showFeedback(isCorrect, message) {
        const feedbackArea = document.getElementById('feedback-area');
        const feedbackMessage = document.getElementById('feedback-message');
        
        if (feedbackArea && feedbackMessage) {
            feedbackMessage.textContent = message;
            feedbackMessage.className = `alert ${isCorrect ? 'alert-success' : 'alert-danger'}`;
            
            feedbackArea.classList.remove('d-none');
            window.MiniGames.animateElement(feedbackMessage, 'fade-in');
        }
    }
    
    hideFeedback() {
        const feedbackArea = document.getElementById('feedback-area');
        if (feedbackArea) {
            feedbackArea.classList.add('d-none');
        }
    }
    
    nextRound() {
        this.currentRound++;
        this.loadNextQuestion();
    }
    
    endGame() {
        this.gameActive = false;
        
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        this.hideGamePlay();
        this.showGameComplete();
        
        // Show congratulations modal
        const message = this.score >= 6 ? 'Excellent work!' : 
                       this.score >= 4 ? 'Good job!' : 'Keep practicing!';
        
        window.MiniGames.showCongratsModal('reverse-google', this.score, this.totalRounds, message);
        
        window.MiniGames.announceToScreenReader(`Game completed. Final score: ${this.score} out of ${this.totalRounds}`);
    }
    
    updateUI() {
        // Update round counter
        const roundCounter = document.getElementById('round-counter');
        if (roundCounter) {
            roundCounter.textContent = `${this.currentRound} / ${this.totalRounds}`;
        }
        
        // Update score
        const scoreCounter = document.getElementById('score-counter');
        if (scoreCounter) {
            scoreCounter.textContent = this.score;
        }
        
        // Update progress bar
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
            const progress = ((this.currentRound - 1) / this.totalRounds) * 100;
            progressBar.style.width = `${progress}%`;
        }
        
        // Update final score in complete screen
        const finalScore = document.getElementById('final-score');
        if (finalScore) {
            finalScore.textContent = this.score;
        }
    }
    
    showInstructions() {
        const instructions = document.getElementById('instructions');
        if (instructions) {
            instructions.classList.remove('d-none');
        }
    }
    
    hideInstructions() {
        const instructions = document.getElementById('instructions');
        if (instructions) {
            instructions.classList.add('d-none');
        }
    }
    
    showGamePlay() {
        const gamePlay = document.getElementById('game-play');
        if (gamePlay) {
            gamePlay.classList.remove('d-none');
        }
    }
    
    hideGamePlay() {
        const gamePlay = document.getElementById('game-play');
        if (gamePlay) {
            gamePlay.classList.add('d-none');
        }
    }
    
    showGameComplete() {
        const gameComplete = document.getElementById('game-complete');
        if (gameComplete) {
            gameComplete.classList.remove('d-none');
            window.MiniGames.animateElement(gameComplete, 'fade-in');
        }
    }
}

// Initialize game
let reverseGoogleGame = null;

document.addEventListener('DOMContentLoaded', function() {
    reverseGoogleGame = new ReverseGoogleGame();
    reverseGoogleGame.init();
});

// Global functions for HTML onclick handlers
function startGame() {
    if (reverseGoogleGame) {
        reverseGoogleGame.startGame();
    }
}

function submitAnswer() {
    if (reverseGoogleGame) {
        reverseGoogleGame.submitAnswer();
    }
}

function nextRound() {
    if (reverseGoogleGame) {
        reverseGoogleGame.nextRound();
    }
}
