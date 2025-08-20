// Turing Test Game Logic

class TuringTestGame {
    constructor() {
        this.currentRound = 1;
        this.totalRounds = 6;
        this.score = 0;
        this.gameActive = false;
        this.currentPrompt = null;
        this.currentResponses = [];
        this.selectedResponse = null;
        this.aiResponseIndex = -1;
        
        // Prompts with human responses
        this.prompts = [
        {
            "prompt": "What's your favorite thing about working on engineering projects?",
            "humanResponses": [
            "Solving complex problems by breaking them into smaller, logical steps.",
            "Seeing a design move from concept to prototype is incredibly satisfying."
            ]
        },
        {
            "prompt": "Describe your ideal weekend as an engineer or tech enthusiast.",
            "humanResponses": [
            "Building side projects with Raspberry Pi and testing new algorithms.",
            "Exploring new tech blogs, tinkering with code, and a bit of hiking to clear the mind."
            ]
        },
        {
            "prompt": "What's something in engineering or tech that always fascinates you?",
            "humanResponses": [
            "How small changes in code can scale to impact thousands of users.",
            "The elegance of logistic systems where timing and precision matter."
            ]
        },
        {
            "prompt": "How do you handle technical stress or tight deadlines?",
            "humanResponses": [
            "Break tasks into modules, automate where possible, and prioritize logically.",
            "Focus on debugging systematically, then recharge with a walk or quick workout."
            ]
        },
        {
            "prompt": "What's your biggest pet peeve in tech or logistics?",
            "humanResponses": [
            "Poorly documented code—it slows down collaboration so much.",
            "When supply chain data isn’t updated in real time, it causes major inefficiencies."
            ]
        },
        {
            "prompt": "Describe the last project or system that impressed you.",
            "humanResponses": [
            "A logistics dashboard that used AI to optimize delivery routes in real-time.",
            "An open-source ML project where the community solved data bottlenecks together."
            ]
        },
        {
            "prompt": "What's your opinion on automation in engineering and logistics?",
            "humanResponses": [
            "It boosts efficiency, but requires strong checks to avoid cascading errors.",
            "Great for repetitive tasks—frees humans for problem-solving and innovation."
            ]
        },
        {
            "prompt": "What would you do with a completely free day as an engineer?",
            "humanResponses": [
            "Experiment with Arduino sensors and build a smart home prototype.",
            "Simulate logistic flows with Python to test optimization models."
            ]
        }
]

        
        this.difficultyLabels = ['Easy', 'Easy', 'Medium', 'Medium', 'Hard', 'Hard'];
    }
    
    init() {
        this.bindEvents();
        this.resetGame();
        this.checkAIStatus();
    }
    
    async checkAIStatus() {
        const statusElement = document.getElementById('ai-status');
        if (!statusElement) return;
        
        try {
            // Test if AI is available
            const testResponse = await window.MiniGames.generateAIText('test');
            if (testResponse && testResponse.toLowerCase().includes('ai')) {
                statusElement.innerHTML = '<span class="text-danger">Basic</span>';
            } else {
                statusElement.innerHTML = '<span class="text-success">Available</span>';
            }
        } catch (error) {
            statusElement.innerHTML = '<span class="text-danger">Offline</span>';
        }
    }
    
    bindEvents() {
        // Response selection will be handled dynamically
    }
    
    resetGame() {
        this.currentRound = 1;
        this.score = 0;
        this.gameActive = false;
        this.selectedResponse = null;
        
        this.updateUI();
        this.showInstructions();
    }
    
    async startGame() {
        this.currentRound = 1;
        this.score = 0;
        this.gameActive = true;
        this.selectedResponse = null;
        
        this.hideInstructions();
        this.showGamePlay();
        
        await this.loadNextRound();
        
        window.MiniGames.announceToScreenReader('Turing Test game started');
    }
    
    async loadNextRound() {
        if (this.currentRound <= this.totalRounds) {
            this.showLoading();
            
            // Select a random prompt
            const promptData = this.prompts[Math.floor(Math.random() * this.prompts.length)];
            this.currentPrompt = promptData;
            
            // Generate AI response
            const difficulty = this.currentRound;
            const aiResponse = await window.MiniGames.generateAIText(promptData.prompt, difficulty);
            
            // Combine and shuffle responses
            const allResponses = [...promptData.humanResponses, aiResponse];
            this.currentResponses = window.MiniGames.shuffleArray(allResponses);
            this.aiResponseIndex = this.currentResponses.indexOf(aiResponse);
            
            this.hideLoading();
            this.displayRound();
            this.updateUI();
        } else {
            this.endGame();
        }
    }
    
    displayRound() {
        // Display prompt
        const promptElement = document.getElementById('prompt-text');
        if (promptElement && this.currentPrompt) {
            promptElement.textContent = this.currentPrompt.prompt;
        }
        
        // Display responses
        const responsesContainer = document.getElementById('responses-container');
        if (responsesContainer) {
            responsesContainer.innerHTML = '';
            
            this.currentResponses.forEach((response, index) => {
                const responseDiv = document.createElement('div');
                responseDiv.className = 'response-option';
                responseDiv.innerHTML = `
                    <div class="d-flex align-items-start">
                        <div class="me-3">
                            <strong>Response ${String.fromCharCode(65 + index)}:</strong>
                        </div>
                        <div class="flex-grow-1">
                            ${response}
                        </div>
                    </div>
                `;
                
                responseDiv.addEventListener('click', () => this.selectResponse(index));
                responsesContainer.appendChild(responseDiv);
            });
        }
        
        this.selectedResponse = null;
        this.hideFeedback();
    }
    
    selectResponse(index) {
        if (!this.gameActive) return;
        
        // Remove previous selection
        document.querySelectorAll('.response-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        // Add selection to clicked option
        const responseOptions = document.querySelectorAll('.response-option');
        if (responseOptions[index]) {
            responseOptions[index].classList.add('selected');
            this.selectedResponse = index;
        }
        
        // Auto-submit after selection
        setTimeout(() => this.submitGuess(), 500);
    }
    
    submitGuess() {
        if (!this.gameActive || this.selectedResponse === null) return;
        
        const isCorrect = this.selectedResponse === this.aiResponseIndex;
        
        if (isCorrect) {
            this.score++;
            this.showFeedback(true, 'Correct! You found the AI response!');
            window.MiniGames.announceToScreenReader('Correct! You identified the AI response.');
        } else {
            this.showFeedback(false, 'Incorrect. That was a human response.');
            window.MiniGames.announceToScreenReader('Incorrect. That was written by a human.');
        }
        
        // Highlight correct and incorrect responses
        this.highlightResponses(isCorrect);
        this.updateUI();
    }
    
    highlightResponses(wasCorrect) {
        const responseOptions = document.querySelectorAll('.response-option');
        
        responseOptions.forEach((option, index) => {
            if (index === this.aiResponseIndex) {
                option.classList.add('correct');
            } else if (index === this.selectedResponse && !wasCorrect) {
                option.classList.add('incorrect');
            }
        });
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
    
    async nextRound() {
        this.currentRound++;
        await this.loadNextRound();
    }
    
    endGame() {
        this.gameActive = false;
        
        this.hideGamePlay();
        this.showGameComplete();
        
        // Performance message
        const performanceElement = document.getElementById('performance-message');
        if (performanceElement) {
            let message = '';
            const percentage = (this.score / this.totalRounds) * 100;
            
            if (percentage >= 80) {
                message = '🎯 Excellent! You have great AI detection skills!';
            } else if (percentage >= 60) {
                message = '👍 Good work! You can spot AI pretty well.';
            } else if (percentage >= 40) {
                message = '🤔 Not bad, but AI is getting trickier to detect.';
            } else {
                message = '🤖 AI fooled you this time! Keep practicing.';
            }
            
            performanceElement.innerHTML = `<p class="text-muted">${message}</p>`;
        }
        
        // Show congratulations modal
        const message = this.score >= 5 ? 'Outstanding AI detection!' : 
                       this.score >= 3 ? 'Good work!' : 'AI is tricky to spot!';
        
        window.MiniGames.showCongratsModal('turing-test', this.score, this.totalRounds, message);
        
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
        
        // Update difficulty
        const difficultyCounter = document.getElementById('difficulty-counter');
        if (difficultyCounter && this.currentRound <= this.totalRounds) {
            difficultyCounter.textContent = this.difficultyLabels[this.currentRound - 1] || 'Hard';
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
    
    showLoading() {
        const loadingArea = document.getElementById('loading-area');
        if (loadingArea) {
            loadingArea.classList.remove('d-none');
        }
        
        const gamePlay = document.getElementById('game-play');
        if (gamePlay) {
            gamePlay.classList.add('d-none');
        }
    }
    
    hideLoading() {
        const loadingArea = document.getElementById('loading-area');
        if (loadingArea) {
            loadingArea.classList.add('d-none');
        }
        
        const gamePlay = document.getElementById('game-play');
        if (gamePlay) {
            gamePlay.classList.remove('d-none');
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
let turingTestGame = null;

document.addEventListener('DOMContentLoaded', function() {
    turingTestGame = new TuringTestGame();
    turingTestGame.init();
});

// Global functions for HTML onclick handlers
function startGame() {
    if (turingTestGame) {
        turingTestGame.startGame();
    }
}

function nextRound() {
    if (turingTestGame) {
        turingTestGame.nextRound();
    }
}
