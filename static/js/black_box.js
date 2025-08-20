// Black Box Challenge Game Logic

class BlackBoxGame {
    constructor() {
        this.gameActive = false;
        this.currentRule = null;
        this.examples = [];
        this.userTests = [];
        this.selectedRule = null;
        this.guessCount = 0;
        this.maxGuesses = 3;
        
        // Mathematical rules
        // this.rules = [
        //     {
        //         id: 'sum_digits',
        //         name: 'Sum of digits',
        //         description: 'Add all digits in the number',
        //         apply: (n) => Math.abs(n).toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0)
        //     },
        //     {
        //         id: 'product_digits',
        //         name: 'Product of digits',
        //         description: 'Multiply all digits in the number',
        //         apply: (n) => Math.abs(n).toString().split('').reduce((product, digit) => product * parseInt(digit), 1)
        //     },
        //     {
        //         id: 'digit_count',
        //         name: 'Number of digits',
        //         description: 'Count how many digits the number has',
        //         apply: (n) => Math.abs(n).toString().length
        //     },
        //     {
        //         id: 'reverse_number',
        //         name: 'Reverse the number',
        //         description: 'Reverse the order of digits',
        //         apply: (n) => parseInt(Math.abs(n).toString().split('').reverse().join('')) || 0
        //     },
        //     {
        //         id: 'square_sum_digits',
        //         name: 'Sum of squared digits',
        //         description: 'Add the squares of all digits',
        //         apply: (n) => Math.abs(n).toString().split('').reduce((sum, digit) => sum + (parseInt(digit) ** 2), 0)
        //     },
        //     {
        //         id: 'alternating_sum',
        //         name: 'Alternating sum of digits',
        //         description: 'Add and subtract digits alternately',
        //         apply: (n) => {
        //             const digits = Math.abs(n).toString().split('');
        //             let sum = 0;
        //             digits.forEach((digit, index) => {
        //                 sum += (index % 2 === 0 ? 1 : -1) * parseInt(digit);
        //             });
        //             return Math.abs(sum);
        //         }
        //     },
        //     {
        //         id: 'sum_times_count',
        //         name: 'Sum of digits × digit count',
        //         description: 'Multiply sum of digits by number of digits',
        //         apply: (n) => {
        //             const str = Math.abs(n).toString();
        //             const sum = str.split('').reduce((sum, digit) => sum + parseInt(digit), 0);
        //             return sum * str.length;
        //         }
        //     },
        //     {
        //         id: 'largest_digit',
        //         name: 'Largest digit',
        //         description: 'Find the largest digit in the number',
        //         apply: (n) => Math.max(...Math.abs(n).toString().split('').map(d => parseInt(d)))
        //     },
        //     {
        //         id: 'smallest_digit',
        //         name: 'Smallest digit',
        //         description: 'Find the smallest digit in the number',
        //         apply: (n) => Math.min(...Math.abs(n).toString().split('').map(d => parseInt(d)))
        //     },
        //     {
        //         id: 'digital_root',
        //         name: 'Digital root',
        //         description: 'Keep summing digits until single digit',
        //         apply: (n) => {
        //             let num = Math.abs(n);
        //             while (num >= 10) {
        //                 num = num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
        //             }
        //             return num;
        //         }
        //     }
        // ];

       this.rules = [
                {
                    id: 'sum_digits',
                    name: 'Sum of digits',
                    description: 'Add all digits in the number',
                    apply: (n) => Math.abs(n).toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0)
                },
                {
                    id: 'product_digits',
                    name: 'Product of digits',
                    description: 'Multiply all digits in the number',
                    apply: (n) => Math.abs(n).toString().split('').reduce((product, digit) => product * parseInt(digit), 1)
                },
                {
                    id: 'digit_count',
                    name: 'Number of digits',
                    description: 'Count how many digits the number has',
                    apply: (n) => Math.abs(n).toString().length
                },
                {
                    id: 'reverse_number',
                    name: 'Reverse the number',
                    description: 'Reverse the order of digits',
                    apply: (n) => parseInt(Math.abs(n).toString().split('').reverse().join('')) || 0
                },
                {
                    id: 'square_sum_digits',
                    name: 'Sum of squared digits',
                    description: 'Add the squares of all digits',
                    apply: (n) => Math.abs(n).toString().split('').reduce((sum, digit) => sum + (parseInt(digit) ** 2), 0)
                },
                {
                    id: 'alternating_sum',
                    name: 'Alternating sum of digits',
                    description: 'Add and subtract digits alternately',
                    apply: (n) => {
                        const digits = Math.abs(n).toString().split('');
                        let sum = 0;
                        digits.forEach((digit, index) => {
                            sum += (index % 2 === 0 ? 1 : -1) * parseInt(digit);
                        });
                        return Math.abs(sum);
                    }
                },
                {
                    id: 'sum_times_count',
                    name: 'Sum of digits × digit count',
                    description: 'Multiply sum of digits by number of digits',
                    apply: (n) => {
                        const str = Math.abs(n).toString();
                        const sum = str.split('').reduce((sum, digit) => sum + parseInt(digit), 0);
                        return sum * str.length;
                    }
                },
                {
                    id: 'largest_digit',
                    name: 'Largest digit',
                    description: 'Find the largest digit in the number',
                    apply: (n) => Math.max(...Math.abs(n).toString().split('').map(d => parseInt(d)))
                },
                {
                    id: 'smallest_digit',
                    name: 'Smallest digit',
                    description: 'Find the smallest digit in the number',
                    apply: (n) => Math.min(...Math.abs(n).toString().split('').map(d => parseInt(d)))
                },
                {
                    id: 'digital_root',
                    name: 'Digital root',
                    description: 'Keep summing digits until single digit',
                    apply: (n) => {
                        let num = Math.abs(n);
                        while (num >= 10) {
                            num = num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
                        }
                        return num;
                    }
                },
                
                // New engineering and logic operations
                {
                    id: 'binary_representation',
                    name: 'Binary representation',
                    description: 'Convert number to binary and count 1s',
                    apply: (n) => {
                        const binary = Math.abs(n).toString(2);
                        return binary.split('1').length - 1;
                    }
                },
                {
                    id: 'prime_digit_count',
                    name: 'Prime digits count',
                    description: 'Count how many digits are prime numbers (2,3,5,7)',
                    apply: (n) => {
                        const primes = ['2','3','5','7'];
                        return Math.abs(n).toString().split('').filter(d => primes.includes(d)).length;
                    }
                },
                {
                    id: 'even_odd_ratio',
                    name: 'Even to odd ratio',
                    description: 'Calculate ratio of even to odd digits (as percentage)',
                    apply: (n) => {
                        const digits = Math.abs(n).toString().split('').map(Number);
                        const evenCount = digits.filter(d => d % 2 === 0).length;
                        const oddCount = digits.length - evenCount;
                        return oddCount === 0 ? 100 : Math.round((evenCount / oddCount) * 100);
                    }
                },
                {
                    id: 'palindrome_score',
                    name: 'Palindrome score',
                    description: 'Check if number is palindrome, score 100 if yes, 0 if no',
                    apply: (n) => {
                        const str = Math.abs(n).toString();
                        return str === str.split('').reverse().join('') ? 100 : 0;
                    }
                },
                {
                    id: 'digit_gcd',
                    name: 'GCD of digits',
                    description: 'Find greatest common divisor of all digits',
                    apply: (n) => {
                        const digits = Math.abs(n).toString().split('').map(Number);
                        const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
                        return digits.reduce((a, b) => gcd(a, b));
                    }
                },
                {
                    id: 'digit_range',
                    name: 'Digit range',
                    description: 'Difference between largest and smallest digit',
                    apply: (n) => {
                        const digits = Math.abs(n).toString().split('').map(Number);
                        return Math.max(...digits) - Math.min(...digits);
                    }
                },
                {
                    id: 'sum_factorial_digits',
                    name: 'Sum of digit factorials',
                    description: 'Sum of factorial of each digit',
                    apply: (n) => {
                        const factorial = (x) => x <= 1 ? 1 : x * factorial(x - 1);
                        return Math.abs(n).toString().split('').reduce((sum, digit) => sum + factorial(parseInt(digit)), 0);
                    }
                },
                {
                    id: 'engineering_checksum',
                    name: 'Engineering checksum',
                    description: 'Weighted sum of digits (position × digit)',
                    apply: (n) => {
                        return Math.abs(n).toString().split('').reduce((sum, digit, idx) => sum + (idx + 1) * parseInt(digit), 0);
                    }
                },
                {
                    id: 'logistic_encoding',
                    name: 'Logistic encoding',
                    description: 'Map digits to binary (even=0, odd=1) and convert to decimal',
                    apply: (n) => {
                        const binary = Math.abs(n).toString().split('').map(d => parseInt(d) % 2 === 0 ? '0' : '1').join('');
                        return parseInt(binary, 2);
                    }
                },
                {
                    id: 'digital_signal_processing',
                    name: 'Digital signal processing',
                    description: 'Calculate alternating sum of squared digits',
                    apply: (n) => {
                        const digits = Math.abs(n).toString().split('').map(Number);
                        return digits.reduce((sum, digit, idx) => sum + (idx % 2 === 0 ? 1 : -1) * (digit ** 2), 0);
                    }
                },
                {
                    id: 'modular_arithmetic',
                    name: 'Modular arithmetic',
                    description: 'Sum of digits mod 9 (digital root alternative)',
                    apply: (n) => {
                        const sum = Math.abs(n).toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
                        return sum % 9 || 9;
                    }
                },
                {
                    id: 'fibonacci_digit_sum',
                    name: 'Fibonacci digit sum',
                    description: 'Sum of digits at Fibonacci positions (1,2,3,5,8...)',
                    apply: (n) => {
                        const digits = Math.abs(n).toString().split('').map(Number);
                        const fibPositions = [1, 2, 3, 5, 8]; // Fibonacci positions
                        return fibPositions
                            .filter(pos => pos <= digits.length)
                            .reduce((sum, pos) => sum + digits[pos - 1], 0);
                    }
                },
                {
                    id: 'prime_position_sum',
                    name: 'Prime position sum',
                    description: 'Sum of digits at prime number positions (2,3,5,7...)',
                    apply: (n) => {
                        const digits = Math.abs(n).toString().split('').map(Number);
                        const isPrime = (num) => {
                            if (num <= 1) return false;
                            for (let i = 2; i <= Math.sqrt(num); i++) {
                                if (num % i === 0) return false;
                            }
                            return true;
                        };
                        
                        return digits
                            .filter((_, idx) => isPrime(idx + 1))
                            .reduce((sum, digit) => sum + digit, 0);
                    }
                },
                {
                    id: 'hamming_weight',
                    name: 'Hamming weight',
                    description: 'Number of non-zero digits',
                    apply: (n) => {
                        return Math.abs(n).toString().split('').filter(d => d !== '0').length;
                    }
                },
                {
                    id: 'binary_coded_decimal',
                    name: 'Binary coded decimal',
                    description: 'Convert each digit to 4-bit binary and count 1s',
                    apply: (n) => {
                        return Math.abs(n).toString().split('').reduce((count, digit) => {
                            const binary = parseInt(digit).toString(2).padStart(4, '0');
                            return count + (binary.split('1').length - 1);
                        }, 0);
                    }
                }
            ];
    }
    
    init() {
        this.bindEvents();
        this.resetGame();
    }
    
    bindEvents() {
        // Test input handling
        const testInput = document.getElementById('test-input');
        if (testInput) {
            testInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.testInput();
                }
            });
        }
    }
    
    resetGame() {
        this.gameActive = false;
        this.currentRule = null;
        this.examples = [];
        this.userTests = [];
        this.selectedRule = null;
        this.guessCount = 0;
        
        this.updateUI();
        this.showInstructions();
    }
    
    startGame() {
        // Select random rule
        this.currentRule = this.rules[Math.floor(Math.random() * this.rules.length)];
        this.gameActive = true;
        this.examples = [];
        this.userTests = [];
        this.selectedRule = null;
        this.guessCount = 0;
        
        this.generateExamples();
        this.generateRuleOptions();
        
        this.hideInstructions();
        this.showGamePlay();
        this.updateUI();
        
        window.MiniGames.announceToScreenReader('Black Box Challenge started. Analyze the examples to find the pattern.');
    }
    
    generateExamples() {
        // Generate 5 example input/output pairs
        const usedInputs = new Set();
        
        while (this.examples.length < 5) {
            // Generate varied inputs to show the pattern clearly
            let input;
            if (this.examples.length < 2) {
                // Simple single-digit numbers first
                input = Math.floor(Math.random() * 9) + 1;
            } else if (this.examples.length < 4) {
                // Two-digit numbers
                input = Math.floor(Math.random() * 90) + 10;
            } else {
                // Three-digit numbers
                input = Math.floor(Math.random() * 900) + 100;
            }
            
            if (!usedInputs.has(input)) {
                usedInputs.add(input);
                const output = this.currentRule.apply(input);
                this.examples.push({ input, output });
            }
        }
        
        this.displayExamples();
    }
    
    displayExamples() {
        const container = document.getElementById('examples-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.examples.forEach((example, index) => {
            const exampleDiv = document.createElement('div');
            exampleDiv.className = 'col-md-2 col-4';
            exampleDiv.innerHTML = `
                <div class="example-item">
                    <div class="fw-bold text-primary">${example.input}</div>
                    <div class="text-muted">↓</div>
                    <div class="fw-bold text-success">${example.output}</div>
                </div>
            `;
            container.appendChild(exampleDiv);
        });
    }
    
    generateRuleOptions() {
        const container = document.getElementById('rule-options');
        if (!container) return;
        
        // Include the correct rule and 4 random incorrect ones
        const incorrectRules = this.rules.filter(rule => rule.id !== this.currentRule.id);
        const shuffledIncorrect = window.MiniGames.shuffleArray(incorrectRules).slice(0, 4);
        const allOptions = window.MiniGames.shuffleArray([this.currentRule, ...shuffledIncorrect]);
        
        container.innerHTML = '';
        
        allOptions.forEach((rule, index) => {
            const ruleDiv = document.createElement('div');
            ruleDiv.className = 'rule-option';
            ruleDiv.innerHTML = `
                <input type="radio" name="rule" value="${rule.id}" id="rule-${rule.id}" class="form-check-input me-2">
                <label for="rule-${rule.id}" class="form-check-label">
                    <strong>${rule.name}:</strong> ${rule.description}
                </label>
            `;
            
            ruleDiv.addEventListener('click', () => {
                // Clear previous selection
                document.querySelectorAll('.rule-option').forEach(option => {
                    option.classList.remove('selected');
                });
                
                // Select this option
                ruleDiv.classList.add('selected');
                const radio = ruleDiv.querySelector('input[type="radio"]');
                radio.checked = true;
                this.selectedRule = rule.id;
            });
            
            container.appendChild(ruleDiv);
        });
    }
    
    testInput() {
        if (!this.gameActive) return;
        
        const inputElement = document.getElementById('test-input');
        const outputElement = document.getElementById('test-output');
        
        if (!inputElement || !outputElement) return;
        
        const inputValue = parseInt(inputElement.value);
        if (isNaN(inputValue)) {
            this.showFeedback(false, 'Please enter a valid number.');
            return;
        }
        
        const output = this.currentRule.apply(inputValue);
        outputElement.textContent = output;
        
        // Add to test history
        this.userTests.push({ input: inputValue, output });
        this.updateTestHistory();
        
        // Clear input
        inputElement.value = '';
        
        this.updateUI();
        
        window.MiniGames.announceToScreenReader(`Input ${inputValue} produces output ${output}`);
    }
    
    updateTestHistory() {
        const historyElement = document.getElementById('test-history');
        const historyBody = document.getElementById('test-history-body');
        
        if (!historyElement || !historyBody) return;
        
        if (this.userTests.length > 0) {
            historyElement.classList.remove('d-none');
            
            historyBody.innerHTML = '';
            this.userTests.forEach(test => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${test.input}</td>
                    <td><strong>${test.output}</strong></td>
                `;
                historyBody.appendChild(row);
            });
        }
    }
    
    submitGuess() {
        if (!this.gameActive || !this.selectedRule) {
            this.showFeedback(false, 'Please select a rule first!');
            return;
        }
        
        this.guessCount++;
        
        if (this.selectedRule === this.currentRule.id) {
            // Correct guess!
            this.winGame();
        } else {
            // Incorrect guess
            if (this.guessCount >= this.maxGuesses) {
                this.loseGame();
            } else {
                this.showFeedback(false, `Incorrect! You have ${this.maxGuesses - this.guessCount} more guess${this.maxGuesses - this.guessCount !== 1 ? 'es' : ''}.`);
                
                // Clear selection
                document.querySelectorAll('.rule-option').forEach(option => {
                    option.classList.remove('selected');
                });
                document.querySelectorAll('input[name="rule"]').forEach(radio => {
                    radio.checked = false;
                });
                this.selectedRule = null;
            }
        }
        
        this.updateUI();
    }
    
    winGame() {
        this.gameActive = false;
        this.showFeedback(true, '🎉 Correct! You found the hidden rule!');
        
        setTimeout(() => {
            this.endGame(true);
        }, 2000);
    }
    
    loseGame() {
        this.gameActive = false;
        this.showFeedback(false, `Game over! The rule was: ${this.currentRule.name}`);
        
        setTimeout(() => {
            this.endGame(false);
        }, 3000);
    }
    
    endGame(won) {
        this.hideGamePlay();
        this.showGameComplete(won);
        
        const score = won ? 3 : 0; // Fixed score for winning
        const message = won ? 'Excellent pattern recognition!' : 'Keep practicing pattern detection!';
        
        window.MiniGames.showCongratsModal('black-box', score, 3, message);
        
        window.MiniGames.announceToScreenReader(won ? 'Congratulations! You found the rule!' : 'Game over. Try again to improve your pattern detection skills.');
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
    
    updateUI() {
        // Update tests count
        const testsCount = document.getElementById('tests-count');
        if (testsCount) {
            testsCount.textContent = this.userTests.length;
        }
        
        // Update guesses count
        const guessesCount = document.getElementById('guesses-count');
        if (guessesCount) {
            guessesCount.textContent = this.guessCount;
        }
        
        // Update difficulty level
        const difficultyLevel = document.getElementById('difficulty-level');
        if (difficultyLevel && this.currentRule) {
            // Determine difficulty based on rule complexity
            const complexRules = ['alternating_sum', 'digital_root', 'sum_times_count'];
            const mediumRules = ['square_sum_digits', 'product_digits', 'reverse_number'];
            
            if (complexRules.includes(this.currentRule.id)) {
                difficultyLevel.textContent = 'Hard';
            } else if (mediumRules.includes(this.currentRule.id)) {
                difficultyLevel.textContent = 'Medium';
            } else {
                difficultyLevel.textContent = 'Easy';
            }
        }
        
        // Update game status
        const gameStatus = document.getElementById('game-status');
        if (gameStatus) {
            if (!this.gameActive) {
                gameStatus.textContent = 'Complete';
                gameStatus.className = 'fw-bold text-success';
            } else if (this.userTests.length > 0) {
                gameStatus.textContent = 'Testing';
                gameStatus.className = 'fw-bold text-info';
            } else {
                gameStatus.textContent = 'Analyzing';
                gameStatus.className = 'fw-bold text-warning';
            }
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
    
    showGameComplete(won) {
        const gameComplete = document.getElementById('game-complete');
        const gameResult = document.getElementById('game-result');
        const completionMessage = document.getElementById('completion-message');
        const ruleExplanation = document.getElementById('rule-explanation');
        
        if (gameComplete) {
            gameComplete.classList.remove('d-none');
            window.MiniGames.animateElement(gameComplete, 'fade-in');
        }
        
        if (gameResult) {
            gameResult.textContent = won ? '🎉 Congratulations!' : '💡 Good Try!';
            gameResult.className = won ? 'text-success mb-3' : 'text-warning mb-3';
        }
        
        if (completionMessage) {
            completionMessage.textContent = won ? 
                `You correctly identified the rule in ${this.guessCount} guess${this.guessCount !== 1 ? 'es' : ''}!` :
                `The pattern was tricky this time. You made ${this.userTests.length} tests and ${this.guessCount} guesses.`;
        }
        
        if (ruleExplanation && this.currentRule) {
            ruleExplanation.innerHTML = `
                <strong>The Rule Was:</strong> ${this.currentRule.name}<br>
                <em>${this.currentRule.description}</em>
            `;
        }
    }
}

// Initialize game
let blackBoxGame = null;

document.addEventListener('DOMContentLoaded', function() {
    blackBoxGame = new BlackBoxGame();
    blackBoxGame.init();
});

// Global functions for HTML onclick handlers
function startGame() {
    if (blackBoxGame) {
        blackBoxGame.startGame();
    }
}

function testInput() {
    if (blackBoxGame) {
        blackBoxGame.testInput();
    }
}

function submitGuess() {
    if (blackBoxGame) {
        blackBoxGame.submitGuess();
    }
}
