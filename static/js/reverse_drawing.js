// Reverse Drawing Game Logic

class ReverseDrawingGame {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.targetCanvas = null;
        this.targetCtx = null;
        this.isDrawing = false;
        this.currentPath = [];
        this.completedShapes = 0;
        this.totalShapes = 3;
        this.currentShapeIndex = 0;
        this.attempts = 0;
        this.gameActive = false;
        
        // Shape definitions
        this.shapes = [
            {
                name: 'Circle',
                description: 'Draw a circle in the center',
                type: 'circle',
                center: { x: 300, y: 200 },
                radius: 80
            },
            {
                name: 'Square',
                description: 'Draw a square in the center',
                type: 'square',
                center: { x: 300, y: 200 },
                size: 120
            },
            {
                name: 'Triangle',
                description: 'Draw a triangle pointing upward',
                type: 'triangle',
                center: { x: 300, y: 200 },
                size: 100
            }
        ];
        
        this.currentShape = null;
        this.accuracyThreshold = 25; // pixels
    }
    
    init() {
        this.setupCanvas();
        this.bindEvents();
        this.resetGame();
    }
    
    setupCanvas() {
        this.canvas = document.getElementById('drawing-canvas');
        this.targetCanvas = document.getElementById('target-canvas');
        
        if (this.canvas) {
            this.ctx = this.canvas.getContext('2d');
            this.ctx.lineWidth = 3;
            this.ctx.strokeStyle = '#0ea5e9';
            this.ctx.lineCap = 'round';
            this.ctx.lineJoin = 'round';
        }
        
        if (this.targetCanvas) {
            this.targetCtx = this.targetCanvas.getContext('2d');
            this.targetCtx.lineWidth = 2;
            this.targetCtx.strokeStyle = '#64748b';
            this.targetCtx.setLineDash([5, 5]);
        }
    }
    
    bindEvents() {
        if (!this.canvas) return;
        
        // Mouse events
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mouseleave', () => this.stopDrawing());
        
        // Touch events for mobile
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousedown', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.canvas.dispatchEvent(mouseEvent);
        });
        
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousemove', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.canvas.dispatchEvent(mouseEvent);
        });
        
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            const mouseEvent = new MouseEvent('mouseup', {});
            this.canvas.dispatchEvent(mouseEvent);
        });
    }
    
    resetGame() {
        this.completedShapes = 0;
        this.currentShapeIndex = 0;
        this.attempts = 0;
        this.gameActive = false;
        this.currentPath = [];
        
        this.updateUI();
        this.showInstructions();
    }
    
    startGame() {
        this.completedShapes = 0;
        this.currentShapeIndex = 0;
        this.attempts = 0;
        this.gameActive = true;
        
        this.hideInstructions();
        this.showGamePlay();
        
        this.loadNextShape();
        
        window.MiniGames.announceToScreenReader('Reverse Drawing game started');
    }
    
    loadNextShape() {
        if (this.currentShapeIndex < this.shapes.length) {
            this.currentShape = this.shapes[this.currentShapeIndex];
            this.currentPath = [];
            
            this.clearCanvas();
            this.drawTargetShape();
            this.updateUI();
            this.hideFeedback();
            
            window.MiniGames.announceToScreenReader(`Drawing ${this.currentShape.name}. ${this.currentShape.description}`);
        } else {
            this.endGame();
        }
    }
    
    drawTargetShape() {
        if (!this.targetCtx || !this.currentShape) return;
        
        this.targetCtx.clearRect(0, 0, this.targetCanvas.width, this.targetCanvas.height);
        this.targetCtx.save();
        
        const centerX = this.targetCanvas.width / 2;
        const centerY = this.targetCanvas.height / 2;
        
        this.targetCtx.beginPath();
        
        switch (this.currentShape.type) {
            case 'circle':
                this.targetCtx.arc(centerX, centerY, 60, 0, 2 * Math.PI);
                break;
                
            case 'square':
                const squareSize = 80;
                this.targetCtx.rect(
                    centerX - squareSize / 2, 
                    centerY - squareSize / 2, 
                    squareSize, 
                    squareSize
                );
                break;
                
            case 'triangle':
                const triangleSize = 70;
                this.targetCtx.moveTo(centerX, centerY - triangleSize / 2);
                this.targetCtx.lineTo(centerX - triangleSize / 2, centerY + triangleSize / 2);
                this.targetCtx.lineTo(centerX + triangleSize / 2, centerY + triangleSize / 2);
                this.targetCtx.closePath();
                break;
        }
        
        this.targetCtx.stroke();
        this.targetCtx.restore();
    }
    
    getCanvasCoordinates(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    }
    
    invertCoordinates(x, y) {
        // Invert coordinates around canvas center
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        const invertedX = centerX - (x - centerX);
        const invertedY = centerY - (y - centerY);
        
        return { x: invertedX, y: invertedY };
    }
    
    startDrawing(e) {
        if (!this.gameActive) return;
        
        this.isDrawing = true;
        const coords = this.getCanvasCoordinates(e);
        const inverted = this.invertCoordinates(coords.x, coords.y);
        
        this.currentPath = [inverted];
        this.ctx.beginPath();
        this.ctx.moveTo(inverted.x, inverted.y);
    }
    
    draw(e) {
        if (!this.isDrawing || !this.gameActive) return;
        
        const coords = this.getCanvasCoordinates(e);
        const inverted = this.invertCoordinates(coords.x, coords.y);
        
        this.currentPath.push(inverted);
        this.ctx.lineTo(inverted.x, inverted.y);
        this.ctx.stroke();
    }
    
    stopDrawing() {
        if (!this.isDrawing) return;
        
        this.isDrawing = false;
        this.ctx.closePath();
    }
    
    clearCanvas() {
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
    
    checkDrawing() {
        if (!this.gameActive || this.currentPath.length < 10) {
            this.showFeedback(false, 'Please draw something first!');
            return;
        }
        
        this.attempts++;
        const accuracy = this.calculateAccuracy();
        
        if (accuracy <= this.accuracyThreshold) {
            // Success
            this.completedShapes++;
            this.showFeedback(true, `Great! Accuracy: ${accuracy.toFixed(1)}px. Shape completed!`);
            
            setTimeout(() => {
                this.currentShapeIndex++;
                this.loadNextShape();
            }, 2000);
        } else {
            // Try again
            this.showFeedback(false, `Not quite right. Accuracy: ${accuracy.toFixed(1)}px. Try again!`);
        }
        
        this.updateUI();
    }
    
    calculateAccuracy() {
        if (!this.currentShape || this.currentPath.length === 0) return 999;
        
        let totalError = 0;
        let sampleCount = 0;
        
        // Sample points from the path
        const sampleInterval = Math.max(1, Math.floor(this.currentPath.length / 50));
        
        for (let i = 0; i < this.currentPath.length; i += sampleInterval) {
            const point = this.currentPath[i];
            const error = this.getDistanceToShape(point);
            totalError += error;
            sampleCount++;
        }
        
        return sampleCount > 0 ? totalError / sampleCount : 999;
    }
    
    getDistanceToShape(point) {
        if (!this.currentShape) return 999;
        
        const shape = this.currentShape;
        const center = shape.center;
        
        switch (shape.type) {
            case 'circle':
                const distanceToCenter = Math.sqrt(
                    Math.pow(point.x - center.x, 2) + Math.pow(point.y - center.y, 2)
                );
                return Math.abs(distanceToCenter - shape.radius);
                
            case 'square':
                const halfSize = shape.size / 2;
                const left = center.x - halfSize;
                const right = center.x + halfSize;
                const top = center.y - halfSize;
                const bottom = center.y + halfSize;
                
                // Distance to nearest edge
                const distanceToLeft = Math.abs(point.x - left);
                const distanceToRight = Math.abs(point.x - right);
                const distanceToTop = Math.abs(point.y - top);
                const distanceToBottom = Math.abs(point.y - bottom);
                
                if (point.x >= left && point.x <= right) {
                    return Math.min(distanceToTop, distanceToBottom);
                } else if (point.y >= top && point.y <= bottom) {
                    return Math.min(distanceToLeft, distanceToRight);
                } else {
                    // Corner distance
                    const cornerDistances = [
                        Math.sqrt(Math.pow(point.x - left, 2) + Math.pow(point.y - top, 2)),
                        Math.sqrt(Math.pow(point.x - right, 2) + Math.pow(point.y - top, 2)),
                        Math.sqrt(Math.pow(point.x - left, 2) + Math.pow(point.y - bottom, 2)),
                        Math.sqrt(Math.pow(point.x - right, 2) + Math.pow(point.y - bottom, 2))
                    ];
                    return Math.min(...cornerDistances);
                }
                
            case 'triangle':
                // Triangle vertices
                const size = shape.size;
                const vertices = [
                    { x: center.x, y: center.y - size / 2 },
                    { x: center.x - size / 2, y: center.y + size / 2 },
                    { x: center.x + size / 2, y: center.y + size / 2 }
                ];
                
                // Distance to nearest edge
                const edgeDistances = [
                    this.distanceToLineSegment(point, vertices[0], vertices[1]),
                    this.distanceToLineSegment(point, vertices[1], vertices[2]),
                    this.distanceToLineSegment(point, vertices[2], vertices[0])
                ];
                
                return Math.min(...edgeDistances);
                
            default:
                return 999;
        }
    }
    
    distanceToLineSegment(point, lineStart, lineEnd) {
        const A = point.x - lineStart.x;
        const B = point.y - lineStart.y;
        const C = lineEnd.x - lineStart.x;
        const D = lineEnd.y - lineStart.y;
        
        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        
        if (lenSq === 0) {
            // Line segment is a point
            return Math.sqrt(A * A + B * B);
        }
        
        let param = dot / lenSq;
        
        let xx, yy;
        
        if (param < 0) {
            xx = lineStart.x;
            yy = lineStart.y;
        } else if (param > 1) {
            xx = lineEnd.x;
            yy = lineEnd.y;
        } else {
            xx = lineStart.x + param * C;
            yy = lineStart.y + param * D;
        }
        
        const dx = point.x - xx;
        const dy = point.y - yy;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    showHint() {
        const hints = {
            circle: 'Move your mouse in the opposite direction of where you want to draw. For a circle, think about making smooth, curved motions.',
            square: 'Draw straight lines, but remember - moving left draws right! Start from a corner and work your way around.',
            triangle: 'Draw three connected lines to form a triangle. Remember the inverted controls - practice the motions first!'
        };
        
        const hint = hints[this.currentShape?.type] || 'Remember: your cursor is inverted! Move opposite to where you want to draw.';
        this.showFeedback(null, `💡 Hint: ${hint}`);
    }
    
    showFeedback(isCorrect, message) {
        const feedbackArea = document.getElementById('feedback-area');
        const feedbackMessage = document.getElementById('feedback-message');
        
        if (feedbackArea && feedbackMessage) {
            feedbackMessage.textContent = message;
            
            if (isCorrect === true) {
                feedbackMessage.className = 'alert alert-success';
            } else if (isCorrect === false) {
                feedbackMessage.className = 'alert alert-danger';
            } else {
                feedbackMessage.className = 'alert alert-info';
            }
            
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
    
    nextShape() {
        // This function is called when feedback has next button
        this.currentShapeIndex++;
        this.loadNextShape();
    }
    
    endGame() {
        this.gameActive = false;
        
        this.hideGamePlay();
        this.showGameComplete();
        
        // Show congratulations modal
        const message = this.completedShapes === 3 ? 'Perfect! All shapes completed!' : 
                       'Good effort! Keep practicing with inverted controls.';
        
        window.MiniGames.showCongratsModal('reverse-drawing', this.completedShapes, this.totalShapes, message);
        
        window.MiniGames.announceToScreenReader(`Game completed. ${this.completedShapes} shapes completed in ${this.attempts} attempts.`);
    }
    
    updateUI() {
        // Update current shape
        const currentShapeElement = document.getElementById('current-shape');
        if (currentShapeElement && this.currentShape) {
            currentShapeElement.textContent = this.currentShape.name;
        }
        
        // Update completed count
        const completedCount = document.getElementById('completed-count');
        if (completedCount) {
            completedCount.textContent = `${this.completedShapes} / ${this.totalShapes}`;
        }
        
        // Update attempts
        const attemptsCount = document.getElementById('attempts-count');
        if (attemptsCount) {
            attemptsCount.textContent = this.attempts;
        }
        
        // Update accuracy display
        const accuracyDisplay = document.getElementById('accuracy-display');
        if (accuracyDisplay && this.currentPath.length > 0) {
            const accuracy = this.calculateAccuracy();
            accuracyDisplay.textContent = `${accuracy.toFixed(1)}px`;
        }
        
        // Update progress bar
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
            const progress = (this.completedShapes / this.totalShapes) * 100;
            progressBar.style.width = `${progress}%`;
        }
        
        // Update shape description
        const shapeDescription = document.getElementById('shape-description');
        if (shapeDescription && this.currentShape) {
            shapeDescription.textContent = this.currentShape.description;
        }
        
        // Update total attempts in complete screen
        const totalAttempts = document.getElementById('total-attempts');
        if (totalAttempts) {
            totalAttempts.textContent = this.attempts;
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
let reverseDrawingGame = null;

document.addEventListener('DOMContentLoaded', function() {
    reverseDrawingGame = new ReverseDrawingGame();
    reverseDrawingGame.init();
});

// Global functions for HTML onclick handlers
function startGame() {
    if (reverseDrawingGame) {
        reverseDrawingGame.startGame();
    }
}

function clearCanvas() {
    if (reverseDrawingGame) {
        reverseDrawingGame.clearCanvas();
        reverseDrawingGame.currentPath = [];
    }
}

function checkDrawing() {
    if (reverseDrawingGame) {
        reverseDrawingGame.checkDrawing();
    }
}

function showHint() {
    if (reverseDrawingGame) {
        reverseDrawingGame.showHint();
    }
}

function nextShape() {
    if (reverseDrawingGame) {
        reverseDrawingGame.nextShape();
    }
}
