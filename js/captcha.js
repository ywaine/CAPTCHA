/**
 * Main CAPTCHA class - handles generation and validation
 */

class OriginalCAPTCHA {
    constructor() {
        this.canvas = document.getElementById('captchaCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.currentChallenge = '';
        this.stats = new CaptchaStats();
        
        this.init();
    }
    
    /**
     * Initialize the CAPTCHA system
     */
    init() {
        this.setupEventListeners();
        this.generateNewCaptcha();
    }
    
    /**
     * Set up event listeners
     */
    setupEventListeners() {
        const userInput = document.getElementById('userInput');
        const verifyBtn = document.getElementById('verifyBtn');
        const newCaptchaBtn = document.getElementById('newCaptchaBtn');
        const resetStatsBtn = document.getElementById('resetStatsBtn');
        
        // Enter key support
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.verifyCaptcha();
            }
        });
        
        // Auto-uppercase input
        userInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.toUpperCase();
        });
        
        // Button events
        verifyBtn.addEventListener('click', () => this.verifyCaptcha());
        newCaptchaBtn.addEventListener('click', () => this.generateNewCaptcha());
        resetStatsBtn.addEventListener('click', () => this.resetStats());
    }
    
    /**
     * Generate a new CAPTCHA challenge
     */
    generateNewCaptcha() {
        this.currentChallenge = CaptchaUtils.generateRandomString();
        this.drawCaptcha();
        document.getElementById('userInput').value = '';
        this.hideResult();
    }
    
    /**
     * Main drawing function
     */
    drawCaptcha() {
        this.clearCanvas();
        this.drawBackground();
        this.drawBackgroundNoise();
        this.drawDistortionLines();
        this.drawCharacters();
        this.drawForegroundNoise();
    }
    
    /**
     * Clear the canvas
     */
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    /**
     * Draw gradient background
     */
    drawBackground() {
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        gradient.addColorStop(0, '#f0f0f0');
        gradient.addColorStop(0.5, '#e0e0e0');
        gradient.addColorStop(1, '#d0d0d0');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    /**
     * Draw background noise patterns
     */
    drawBackgroundNoise() {
        // Random dots
        for (let i = 0; i < 50; i++) {
            this.ctx.fillStyle = CaptchaUtils.getRandomColor(0.3);
            this.ctx.beginPath();
            this.ctx.arc(
                Math.random() * this.canvas.width,
                Math.random() * this.canvas.height,
                Math.random() * 2 + 1,
                0,
                2 * Math.PI
            );
            this.ctx.fill();
        }
        
        // Random rectangles
        for (let i = 0; i < 10; i++) {
            this.ctx.fillStyle = CaptchaUtils.getRandomColor(0.1);
            this.ctx.fillRect(
                Math.random() * this.canvas.width,
                Math.random() * this.canvas.height,
                Math.random() * 20 + 5,
                Math.random() * 20 + 5
            );
        }
    }
    
    /**
     * Draw distortion lines
     */
    drawDistortionLines() {
        for (let i = 0; i < 3; i++) {
            this.ctx.strokeStyle = CaptchaUtils.getRandomColor(0.4);
            this.ctx.lineWidth = Math.random() * 3 + 1;
            this.ctx.beginPath();
            
            const startX = Math.random() * this.canvas.width;
            const startY = Math.random() * this.canvas.height;
            this.ctx.moveTo(startX, startY);
            
            for (let j = 0; j < 3; j++) {
                this.ctx.quadraticCurveTo(
                    Math.random() * this.canvas.width,
                    Math.random() * this.canvas.height,
                    Math.random() * this.canvas.width,
                    Math.random() * this.canvas.height
                );
            }
            this.ctx.stroke();
        }
    }
    
    /**
     * Draw the main characters
     */
    drawCharacters() {
        const text = this.currentChallenge;
        const charWidth = this.canvas.width / (text.length + 1);
        
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const x = charWidth * (i + 0.5) + CaptchaUtils.randomBetween(-10, 10);
            const y = this.canvas.height / 2 + CaptchaUtils.randomBetween(-15, 15);
            
            this.drawSingleCharacter(char, x, y);
        }
    }
    
    /**
     * Draw a single character with distortion
     * @param {string} char - Character to draw
     * @param {number} x - X position
     * @param {number} y - Y position
     */
    drawSingleCharacter(char, x, y) {
        this.ctx.save();
        
        // Random rotation
        const rotation = CaptchaUtils.randomBetween(-0.25, 0.25);
        this.ctx.translate(x, y);
        this.ctx.rotate(rotation);
        
        // Random font and size
        const fontSize = CaptchaUtils.randomBetween(25, 45);
        const font = CaptchaUtils.getRandomFont();
        this.ctx.font = `bold ${fontSize}px ${font}`;
        
        // Random colors
        this.ctx.fillStyle = CaptchaUtils.getRandomColor(0.8);
        this.ctx.strokeStyle = CaptchaUtils.getRandomColor(0.6);
        this.ctx.lineWidth = 1;
        
        // Draw character with outline
        this.ctx.fillText(char, -10, 5);
        this.ctx.strokeText(char, -10, 5);
        
        this.ctx.restore();
    }
    
    /**
     * Draw foreground noise
     */
    drawForegroundNoise() {
        // Random lines over text
        for (let i = 0; i < 5; i++) {
            this.ctx.strokeStyle = CaptchaUtils.getRandomColor(0.2);
            this.ctx.lineWidth = Math.random() * 2 + 0.5;
            this.ctx.beginPath();
            this.ctx.moveTo(Math.random() * this.canvas.width, Math.random() * this.canvas.height);
            this.ctx.lineTo(Math.random() * this.canvas.width, Math.random() * this.canvas.height);
            this.ctx.stroke();
        }
        
        // Random dots over text
        for (let i = 0; i < 20; i++) {
            this.ctx.fillStyle = CaptchaUtils.getRandomColor(0.3);
            this.ctx.beginPath();
            this.ctx.arc(
                Math.random() * this.canvas.width,
                Math.random() * this.canvas.height,
                Math.random() * 1.5 + 0.5,
                0,
                2 * Math.PI
            );
            this.ctx.fill();
        }
    }
    
    /**
     * Verify user input against the challenge
     */
    verifyCaptcha() {
        const userInput = document.getElementById('userInput').value.toUpperCase();
        const resultDiv = document.getElementById('result');
        
        if (!CaptchaUtils.isValidInput(userInput)) {
            this.showResult('Please enter only letters and numbers.', 'error');
            return;
        }
        
        const isCorrect = userInput === this.currentChallenge;
        this.stats.recordAttempt(isCorrect);
        
        if (isCorrect) {
            this.showResult('✅ Correct! You have successfully completed the CAPTCHA.', 'success');
            setTimeout(() => this.generateNewCaptcha(), 1500);
        } else {
            this.showResult(`❌ Incorrect. The correct answer was: <strong>${this.currentChallenge}</strong>`, 'error');
            setTimeout(() => this.generateNewCaptcha(), 3000);
        }
    }
    
    /**
     * Show result message
     * @param {string} message - Message to display
     * @param {string} type - Type of message ('success' or 'error')
     */
    showResult(message, type) {
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = message;
        resultDiv.className = `result ${type}`;
        resultDiv.style.display = 'block';
    }
    
    /**
     * Hide result message
     */
    hideResult() {
        document.getElementById('result').style.display = 'none';
    }
    
    /**
     * Reset statistics
     */
    resetStats() {
        this.stats.reset();
        this.generateNewCaptcha();
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    new OriginalCAPTCHA();
});