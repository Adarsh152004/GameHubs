// Enhanced Reverse Drawing Game Logic with More Shapes

class ReverseDrawingGame {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.targetCanvas = null;
        this.targetCtx = null;
        this.isDrawing = false;
        this.currentPath = [];
        this.completedShapes = 0;
        this.totalShapes = 5; // Show 5 random shapes from the available ones
        this.currentShapeIndex = 0;
        this.attempts = 0;
        this.gameActive = false;
        
        // Enhanced shape definitions - 12 different shapes
        this.allShapes = [
            {
                name: 'Circle',
                description: 'Draw a perfect circle in the center',
                type: 'circle',
                center: { x: 300, y: 200 },
                radius: 80,
                difficulty: 1
            },
            {
                name: 'Square',
                description: 'Draw a square with equal sides',
                type: 'square',
                center: { x: 300, y: 200 },
                size: 120,
                difficulty: 1
            },
            {
                name: 'Triangle',
                description: 'Draw an equilateral triangle pointing upward',
                type: 'triangle',
                center: { x: 300, y: 200 },
                size: 100,
                difficulty: 2
            },
            {
                name: 'Heart',
                description: 'Draw a symmetrical heart shape',
                type: 'heart',
                center: { x: 300, y: 200 },
                size: 80,
                difficulty: 3
            },
            {
                name: 'Star',
                description: 'Draw a 5-pointed star',
                type: 'star',
                center: { x: 300, y: 200 },
                size: 90,
                points: 5,
                difficulty: 3
            },
            {
                name: 'Diamond',
                description: 'Draw a diamond shape (rotated square)',
                type: 'diamond',
                center: { x: 300, y: 200 },
                size: 100,
                difficulty: 2
            },
            {
                name: 'Hexagon',
                description: 'Draw a regular hexagon',
                type: 'polygon',
                center: { x: 300, y: 200 },
                size: 85,
                sides: 6,
                difficulty: 2
            },
            {
                name: 'Pentagon',
                description: 'Draw a regular pentagon',
                type: 'polygon',
                center: { x: 300, y: 200 },
                size: 90,
                sides: 5,
                difficulty: 2
            },
            {
                name: 'Cross',
                description: 'Draw a plus sign cross',
                type: 'cross',
                center: { x: 300, y: 200 },
                size: 100,
                difficulty: 2
            },
            {
                name: 'Spiral',
                description: 'Draw a simple spiral from center outward',
                type: 'spiral',
                center: { x: 300, y: 200 },
                size: 70,
                rotations: 2,
                difficulty: 3
            },
            {
                name: 'Infinity',
                description: 'Draw an infinity symbol (∞)',
                type: 'infinity',
                center: { x: 300, y: 200 },
                size: 80,
                difficulty: 4
            },
            {
                name: 'Arrow',
                description: 'Draw a right-pointing arrow',
                type: 'arrow',
                center: { x: 300, y: 200 },
                size: 100,
                direction: 'right',
                difficulty: 2
            }
        ];
        
        this.shapes = []; // Will be populated with random selection
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
    
    selectRandomShapes() {
        // Select 5 random shapes from all available shapes
        const shuffled = [...this.allShapes].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, this.totalShapes);
    }
    
    resetGame() {
        this.shapes = this.selectRandomShapes();
        this.completedShapes = 0;
        this.currentShapeIndex = 0;
        this.attempts = 0;
        this.gameActive = false;
        this.currentPath = [];
        
        this.updateUI();
        this.showInstructions();
    }
    
    startGame() {
        this.shapes = this.selectRandomShapes();
        this.completedShapes = 0;
        this.currentShapeIndex = 0;
        this.attempts = 0;
        this.gameActive = true;
        
        this.hideInstructions();
        this.showGamePlay();
        
        this.loadNextShape();
        
        window.MiniGames.announceToScreenReader('Reverse Drawing game started with new shapes');
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
                
            case 'heart':
                this.drawHeart(this.targetCtx, centerX, centerY, 50);
                break;
                
            case 'star':
                this.drawStar(this.targetCtx, centerX, centerY, 5, 45, 20);
                break;
                
            case 'diamond':
                const diamondSize = 60;
                this.targetCtx.moveTo(centerX, centerY - diamondSize);
                this.targetCtx.lineTo(centerX + diamondSize, centerY);
                this.targetCtx.lineTo(centerX, centerY + diamondSize);
                this.targetCtx.lineTo(centerX - diamondSize, centerY);
                this.targetCtx.closePath();
                break;
                
            case 'polygon':
                this.drawPolygon(this.targetCtx, centerX, centerY, this.currentShape.sides, 55);
                break;
                
            case 'cross':
                const crossSize = 40;
                this.targetCtx.moveTo(centerX - crossSize, centerY);
                this.targetCtx.lineTo(centerX + crossSize, centerY);
                this.targetCtx.moveTo(centerX, centerY - crossSize);
                this.targetCtx.lineTo(centerX, centerY + crossSize);
                break;
                
            case 'spiral':
                this.drawSpiral(this.targetCtx, centerX, centerY, 2, 50);
                break;
                
            case 'infinity':
                this.drawInfinity(this.targetCtx, centerX, centerY, 35);
                break;
                
            case 'arrow':
                this.drawArrow(this.targetCtx, centerX, centerY, 60, 'right');
                break;
        }
        
        this.targetCtx.stroke();
        this.targetCtx.restore();
    }
    
    drawHeart(ctx, x, y, size) {
        ctx.moveTo(x, y);
        ctx.bezierCurveTo(
            x, y - size * 2,
            x - size * 2, y,
            x, y + size * 2
        );
        ctx.bezierCurveTo(
            x + size * 2, y,
            x, y - size * 2,
            x, y
        );
    }
    
    drawStar(ctx, x, y, points, outerRadius, innerRadius) {
        const angle = Math.PI / points;
        
        ctx.moveTo(x, y - outerRadius);
        
        for (let i = 0; i < 2 * points; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const currentAngle = i * angle - Math.PI / 2;
            ctx.lineTo(
                x + radius * Math.cos(currentAngle),
                y + radius * Math.sin(currentAngle)
            );
        }
        
        ctx.closePath();
    }
    
    drawPolygon(ctx, x, y, sides, radius) {
        ctx.moveTo(x + radius * Math.cos(0), y + radius * Math.sin(0));
        
        for (let i = 1; i <= sides; i++) {
            ctx.lineTo(
                x + radius * Math.cos(i * 2 * Math.PI / sides),
                y + radius * Math.sin(i * 2 * Math.PI / sides)
            );
        }
        
        ctx.closePath();
    }
    
    drawSpiral(ctx, x, y, rotations, maxRadius) {
        const segments = 100;
        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * rotations * 2 * Math.PI;
            const radius = (i / segments) * maxRadius;
            
            if (i === 0) {
                ctx.moveTo(
                    x + radius * Math.cos(angle),
                    y + radius * Math.sin(angle)
                );
            } else {
                ctx.lineTo(
                    x + radius * Math.cos(angle),
                    y + radius * Math.sin(angle)
                );
            }
        }
    }
    
    drawInfinity(ctx, x, y, size) {
        ctx.moveTo(x - size, y);
        ctx.bezierCurveTo(
            x - size * 2, y - size,
            x, y + size,
            x + size, y
        );
        ctx.bezierCurveTo(
            x + size * 2, y + size,
            x, y - size,
            x - size, y
        );
    }
    
    drawArrow(ctx, x, y, size, direction) {
        const headSize = size * 0.3;
        
        switch (direction) {
            case 'right':
                ctx.moveTo(x - size, y);
                ctx.lineTo(x + size, y);
                ctx.lineTo(x + size - headSize, y - headSize);
                ctx.moveTo(x + size, y);
                ctx.lineTo(x + size - headSize, y + headSize);
                break;
            case 'left':
                ctx.moveTo(x + size, y);
                ctx.lineTo(x - size, y);
                ctx.lineTo(x - size + headSize, y - headSize);
                ctx.moveTo(x - size, y);
                ctx.lineTo(x - size + headSize, y + headSize);
                break;
            case 'up':
                ctx.moveTo(x, y + size);
                ctx.lineTo(x, y - size);
                ctx.lineTo(x - headSize, y - size + headSize);
                ctx.moveTo(x, y - size);
                ctx.lineTo(x + headSize, y - size + headSize);
                break;
            case 'down':
                ctx.moveTo(x, y - size);
                ctx.lineTo(x, y + size);
                ctx.lineTo(x - headSize, y + size - headSize);
                ctx.moveTo(x, y + size);
                ctx.lineTo(x + headSize, y + size - headSize);
                break;
        }
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
        
        // Adjust threshold based on shape difficulty
        const adjustedThreshold = this.accuracyThreshold + (this.currentShape.difficulty * 5);
        
        if (accuracy <= adjustedThreshold) {
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
                
            case 'heart':
            case 'star':
            case 'polygon':
            case 'cross':
            case 'spiral':
            case 'infinity':
            case 'arrow':
            case 'diamond':
                // For complex shapes, use distance to center as approximation
                // This is a simplified approach - you could implement more precise detection
                return Math.sqrt(
                    Math.pow(point.x - center.x, 2) + Math.pow(point.y - center.y, 2)
                ) - 50; // Approximate distance to shape boundary
                
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
            circle: 'Move your mouse in smooth, continuous circles. Remember the inversion - moving clockwise draws counterclockwise!',
            square: 'Draw straight lines with sharp corners. Start from one corner and work your way around the square.',
            triangle: 'Draw three connected straight lines. Focus on making the sides equal length.',
            heart: 'Draw two curved bumps at the top meeting at a point at the bottom. It\'s like two circles meeting.',
            star: 'Draw alternating long and short lines radiating from the center. Five points total.',
            diamond: 'Draw a rotated square with four equal sides at 45-degree angles.',
            polygon: 'Draw straight lines connecting to form a shape with equal sides.',
            cross: 'Draw one vertical and one horizontal line crossing in the center.',
            spiral: 'Start from the center and slowly spiral outward with increasing radius.',
            infinity: 'Draw two loops connected in the middle, like a sideways figure eight.',
            arrow: 'Draw a straight line with a triangular head at one end.'
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
        this.currentShapeIndex++;
        this.loadNextShape();
    }
    
    endGame() {
        this.gameActive = false;
        
        this.hideGamePlay();
        this.showGameComplete();
        
        // Calculate score based on accuracy and attempts
        const efficiency = this.attempts > 0 ? (this.completedShapes / this.attempts) * 100 : 0;
        const message = efficiency > 80 ? 'Excellent precision!' : 
                       efficiency > 60 ? 'Great job!' : 'Good effort! Keep practicing.';
        
        window.MiniGames.showCongratsModal('reverse-drawing', this.completedShapes, this.totalShapes, message);
        
        window.MiniGames.announceToScreenReader(`Game completed. ${this.completedShapes} shapes completed in ${this.attempts} attempts.`);
    }
    
    updateUI() {
        // Update current shape
        const currentShapeElement = document.getElementById('current-shape');
        if (currentShapeElement && this.currentShape) {
            currentShapeElement.textContent = this.currentShape.name;
            currentShapeElement.className = `badge bg-${
                this.currentShape.difficulty === 1 ? 'success' : 
                this.currentShape.difficulty === 2 ? 'warning' : 
                this.currentShape.difficulty === 3 ? 'danger' : 'dark'
            }`;
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
            accuracyDisplay.className = `badge ${
                accuracy <= 15 ? 'bg-success' :
                accuracy <= 30 ? 'bg-warning' : 'bg-danger'
            }`;
        }
        
        // Update progress bar
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
            const progress = (this.completedShapes / this.totalShapes) * 100;
            progressBar.style.width = `${progress}%`;
            progressBar.setAttribute('aria-valuenow', progress);
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
        
        // Update shape list in complete screen
        const shapeList = document.getElementById('shape-list');
        if (shapeList) {
            shapeList.innerHTML = this.shapes
                .map((shape, index) => 
                    `<li class="${index < this.completedShapes ? 'text-success' : 'text-danger'}">
                        ${shape.name} ${index < this.completedShapes ? '✓' : '✗'}
                    </li>`
                )
                .join('');
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