// Gesture Memory Game Logic (Emoji Simon)

class GestureMemoryGame {
    constructor() {
        this.sequence = [];
        this.playerInput = [];
        this.gameActive = false;
        this.showingSequence = false;
        this.inputPhase = false;
        this.currentStep = 0;
        this.score = 0;
        this.targetLength = 8; // Win condition
        
        // Available gestures
        this.gestures = ['✌️', '👋', '👍', '👌', '👎', '👏'];
        
        // Animation timing
        this.showDuration = 800;
        this.pauseDuration = 400;
    }
    
    init() {
        this.bindEvents();
        this.resetGame();
    }
    
    bindEvents() {
        // Gesture buttons are handled by onclick in HTML
    }
    
    resetGame() {
        this.sequence = [];
        this.playerInput = [];
        this.gameActive = false;
        this.showingSequence = false;
        this.inputPhase = false;
        this.currentStep = 0;
        this.score = 0;
        
        this.updateUI();
        this.showInstructions();
    }
    
    startGame() {
        this.sequence = [];
        this.playerInput = [];
        this.gameActive = true;
        this.score = 0;
        
        this.hideInstructions();
        this.showGamePlay();
        
        this.nextRound();
        
        window.MiniGames.announceToScreenReader('Gesture Memory game started');
    }
    
    nextRound() {
        // Add new gesture to sequence
        const randomGesture = this.gestures[Math.floor(Math.random() * this.gestures.length)];
        this.sequence.push(randomGesture);
        this.score = this.sequence.length - 1; // Score is rounds completed
        
        this.playerInput = [];
        this.currentStep = 0;
        
        this.updateUI();
        this.showSequence();
    }
    
    async showSequence() {
        this.showingSequence = true;
        this.inputPhase = false;
        this.updatePhaseIndicator('Watching');
        
        const sequenceDisplay = document.getElementById('sequence-display');
        const inputArea = document.getElementById('input-area');
        
        if (sequenceDisplay) {
            sequenceDisplay.innerHTML = '<p class="text-muted">Watch carefully...</p>';
        }
        
        if (inputArea) {
            inputArea.classList.add('d-none');
        }
        
        // Wait a moment before starting
        await this.delay(1000);
        
        // Show each gesture in sequence
        for (let i = 0; i < this.sequence.length; i++) {
            const gesture = this.sequence[i];
            
            if (sequenceDisplay) {
                sequenceDisplay.innerHTML = `
                    <div class="sequence-emoji highlight">${gesture}</div>
                `;
                
                window.MiniGames.announceToScreenReader(`Gesture ${i + 1}: ${gesture}`);
            }
            
            await this.delay(this.showDuration);
            
            // Remove highlight
            const emojiElement = sequenceDisplay.querySelector('.sequence-emoji');
            if (emojiElement) {
                emojiElement.classList.remove('highlight');
            }
            
            await this.delay(this.pauseDuration);
        }
        
        // Clear display and start input phase
        if (sequenceDisplay) {
            sequenceDisplay.innerHTML = '<p class="text-muted">Now repeat the sequence!</p>';
        }
        
        this.showingSequence = false;
        this.inputPhase = true;
        this.updatePhaseIndicator('Input');
        
        if (inputArea) {
            inputArea.classList.remove('d-none');
        }
        
        this.updatePlayerSequenceDisplay();
        
        window.MiniGames.announceToScreenReader('Your turn! Repeat the sequence.');
    }
    
    selectGesture(gesture) {
        if (!this.gameActive || this.showingSequence || !this.inputPhase) return;
        
        this.playerInput.push(gesture);
        this.updatePlayerSequenceDisplay();
        
        // Animate the selected button
        const gestureBtn = document.querySelector(`[data-gesture="${gesture}"]`);
        if (gestureBtn) {
            gestureBtn.classList.add('active');
            setTimeout(() => {
                gestureBtn.classList.remove('active');
            }, 200);
        }
        
        window.MiniGames.announceToScreenReader(`Selected ${gesture}`);
    }
    
    updatePlayerSequenceDisplay() {
        const playerSequence = document.getElementById('player-sequence');
        if (playerSequence) {
            if (this.playerInput.length === 0) {
                playerSequence.innerHTML = '<p class="text-muted">Your sequence will appear here...</p>';
            } else {
                const gestureHTML = this.playerInput.map(gesture => 
                    `<span class="sequence-emoji">${gesture}</span>`
                ).join('');
                playerSequence.innerHTML = gestureHTML;
            }
        }
    }
    
    clearInput() {
        if (!this.gameActive || this.showingSequence) return;
        
        this.playerInput = [];
        this.updatePlayerSequenceDisplay();
        
        window.MiniGames.announceToScreenReader('Input cleared');
    }
    
    submitSequence() {
        if (!this.gameActive || this.showingSequence || !this.inputPhase) return;
        
        if (this.playerInput.length !== this.sequence.length) {
            this.showFeedback(false, `Please enter all ${this.sequence.length} gestures!`);
            return;
        }
        
        // Check if sequence matches
        const isCorrect = this.playerInput.every((gesture, index) => 
            gesture === this.sequence[index]
        );
        
        if (isCorrect) {
            if (this.sequence.length >= this.targetLength) {
                // Win condition reached
                this.winGame();
            } else {
                // Continue to next round
                this.showFeedback(true, 'Correct! Get ready for the next sequence...');
                setTimeout(() => {
                    this.nextRound();
                }, 2000);
            }
        } else {
            // Game over
            this.loseGame();
        }
    }
    
    winGame() {
        this.gameActive = false;
        this.showFeedback(true, `🎉 Amazing! You completed a sequence of ${this.targetLength}!`);
        
        setTimeout(() => {
            this.endGame('🎉 You Won!', 'Incredible memory skills!');
        }, 2000);
    }
    
    loseGame() {
        this.gameActive = false;
        this.showFeedback(false, 'Incorrect sequence! Game over.');
        
        setTimeout(() => {
            this.endGame('Game Over', 'Good effort! Keep practicing to improve your memory.');
        }, 2000);
    }
    
    endGame(resultTitle, resultMessage) {
        this.hideGamePlay();
        this.showGameComplete(resultTitle);
        
        // Show congratulations modal
        const message = this.score >= 6 ? 'Outstanding memory!' : 
                       this.score >= 4 ? 'Good work!' : 'Keep practicing!';
        
        window.MiniGames.showCongratsModal('gesture-memory', this.score, null, message);
        
        window.MiniGames.announceToScreenReader(`${resultTitle}. Final score: ${this.score}`);
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
    
    updatePhaseIndicator(phase) {
        const phaseIndicator = document.getElementById('phase-indicator');
        if (phaseIndicator) {
            phaseIndicator.textContent = phase;
        }
    }
    
    updateUI() {
        // Update sequence length
        const sequenceLength = document.getElementById('sequence-length');
        if (sequenceLength) {
            sequenceLength.textContent = this.sequence.length || 1;
        }
        
        // Update score
        const scoreCounter = document.getElementById('score-counter');
        if (scoreCounter) {
            scoreCounter.textContent = this.score;
        }
        
        // Update progress bar
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
            const progress = (this.sequence.length / this.targetLength) * 100;
            progressBar.style.width = `${Math.min(progress, 100)}%`;
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
    
    showGameComplete(resultTitle) {
        const gameComplete = document.getElementById('game-complete');
        const gameResult = document.getElementById('game-result');
        
        if (gameComplete) {
            gameComplete.classList.remove('d-none');
            window.MiniGames.animateElement(gameComplete, 'fade-in');
        }
        
        if (gameResult) {
            gameResult.textContent = resultTitle;
            gameResult.className = this.score >= 6 ? 'text-success mb-3' : 'text-warning mb-3';
        }
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize game
let gestureMemoryGame = null;

document.addEventListener('DOMContentLoaded', function() {
    gestureMemoryGame = new GestureMemoryGame();
    gestureMemoryGame.init();
});

// Global functions for HTML onclick handlers
function startGame() {
    if (gestureMemoryGame) {
        gestureMemoryGame.startGame();
    }
}

function selectGesture(gesture) {
    if (gestureMemoryGame) {
        gestureMemoryGame.selectGesture(gesture);
    }
}

function clearInput() {
    if (gestureMemoryGame) {
        gestureMemoryGame.clearInput();
    }
}

function submitSequence() {
    if (gestureMemoryGame) {
        gestureMemoryGame.submitSequence();
    }
}

function nextRound() {
    if (gestureMemoryGame) {
        gestureMemoryGame.nextRound();
    }
}
