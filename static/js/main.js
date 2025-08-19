// Main JavaScript file for Mini Games Collection
// Handles shared functionality across all games

// Game configuration
const GAMES = {
    'reverse-google': 'Reverse Google',
    'turing-test': 'Turing Test Puzzle',
    'gesture-memory': 'Gesture Memory',
    'reverse-drawing': 'Reverse Drawing',
    'black-box': 'Black Box Challenge'
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    updateWinsCounter();
    setupEventListeners();
});

// Setup global event listeners
function setupEventListeners() {
    // Handle enter key in input fields
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const activeElement = document.activeElement;
            if (activeElement.tagName === 'INPUT' && activeElement.type === 'text') {
                // Find and trigger the primary submit button
                const submitBtn = document.querySelector('.btn-primary[onclick*="submit"], .btn-success[onclick*="submit"]');
                if (submitBtn && !submitBtn.disabled) {
                    submitBtn.click();
                }
            }
        }
    });
}

// LocalStorage management for game history
function getGameHistory(gameKey) {
    try {
        const history = localStorage.getItem(`game_history_${gameKey}`);
        return history ? JSON.parse(history) : [];
    } catch (error) {
        console.error('Error loading game history:', error);
        return [];
    }
}

function saveGameResult(gameKey, score, maxScore, completed = true) {
    try {
        const history = getGameHistory(gameKey);
        const result = {
            score: score,
            maxScore: maxScore,
            completed: completed,
            date: new Date().toISOString(),
            timestamp: Date.now()
        };
        
        history.push(result);
        
        // Keep only the last 50 games to prevent localStorage bloat
        if (history.length > 50) {
            history.splice(0, history.length - 50);
        }
        
        localStorage.setItem(`game_history_${gameKey}`, JSON.stringify(history));
        updateWinsCounter();
        
        return result;
    } catch (error) {
        console.error('Error saving game result:', error);
        return null;
    }
}

function getTotalWins() {
    let totalWins = 0;
    Object.keys(GAMES).forEach(gameKey => {
        const history = getGameHistory(gameKey);
        totalWins += history.filter(game => game.completed).length;
    });
    return totalWins;
}

function updateWinsCounter() {
    const winsElement = document.getElementById('wins-count');
    if (winsElement) {
        winsElement.textContent = getTotalWins();
    }
}

// Congratulations modal functionality
function showCongratsModal(gameKey, score, maxScore, message = '') {
    const modal = document.getElementById('congratsModal');
    const gameNameElement = document.getElementById('congrats-game-name');
    const scoreElement = document.getElementById('congrats-score');
    const messageElement = document.getElementById('congrats-message');
    
    if (modal && gameNameElement && scoreElement) {
        gameNameElement.textContent = GAMES[gameKey] + ' Complete!';
        scoreElement.textContent = `Your Score: ${score}${maxScore ? ` / ${maxScore}` : ''}`;
        
        if (messageElement && message) {
            messageElement.textContent = message;
        }
        
        // Save the game result
        saveGameResult(gameKey, score, maxScore, true);
        
        // Show the modal using Bootstrap
        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();
    }
}

function returnToHome() {
    window.location.href = '/';
}

// AI text generation helper
async function generateAIText(prompt, difficulty = 1) {
    try {
        // Try backend API first
        const response = await fetch('/api/ai/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: prompt,
                difficulty: difficulty
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            return data.text;
        } else {
            throw new Error('Backend API failed');
        }
    } catch (error) {
        console.warn('AI generation failed:', error);
        // Return a fallback response
        return generateFallbackResponse(prompt, difficulty);
    }
}

function generateFallbackResponse(prompt, difficulty = 1) {
    // Simple fallback responses for when AI is unavailable
    const responses = [
        "That's really interesting, I hadn't thought of it that way before.",
        "Yeah, I can see what you mean there.",
        "Interesting perspective, thanks for sharing that.",
        "That makes a lot of sense when you put it like that.",
        "I appreciate you bringing that up, good point."
    ];
    
    let response = responses[Math.floor(Math.random() * responses.length)];
    
    // Make it more obviously AI-like for lower difficulties
    if (difficulty <= 2) {
        response = "As an AI, I would say that " + response.toLowerCase();
    }
    
    return response;
}

// Utility functions
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Animation helpers
function animateElement(element, className, duration = 1000) {
    element.classList.add(className);
    setTimeout(() => {
        element.classList.remove(className);
    }, duration);
}

function fadeIn(element, duration = 300) {
    element.style.opacity = '0';
    element.style.display = 'block';
    
    const start = performance.now();
    
    function animate(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        
        element.style.opacity = progress;
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
}

function fadeOut(element, duration = 300) {
    const start = performance.now();
    const startOpacity = parseFloat(element.style.opacity) || 1;
    
    function animate(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        
        element.style.opacity = startOpacity * (1 - progress);
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            element.style.display = 'none';
        }
    }
    
    requestAnimationFrame(animate);
}

// Error handling
function handleError(error, context = 'Application') {
    console.error(`${context} Error:`, error);
    
    // Show user-friendly error message
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-danger alert-dismissible fade show position-fixed';
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '9999';
    alertDiv.style.maxWidth = '400px';
    
    alertDiv.innerHTML = `
        <strong>Error:</strong> Something went wrong. Please try again.
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// Accessibility helpers
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// Export functions for use in other scripts
window.MiniGames = {
    getGameHistory,
    saveGameResult,
    getTotalWins,
    updateWinsCounter,
    showCongratsModal,
    returnToHome,
    generateAIText,
    shuffleArray,
    formatTime,
    debounce,
    animateElement,
    fadeIn,
    fadeOut,
    handleError,
    announceToScreenReader
};
