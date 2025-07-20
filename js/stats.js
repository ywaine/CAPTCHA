/**
 * Statistics management for CAPTCHA system
 */

class CaptchaStats {
    constructor() {
        this.stats = {
            total: 0,
            successful: 0,
            startTime: Date.now(),
            difficulty: 'medium'
        };
        this.loadStats();
    }
    
    /**
     * Record an attempt
     * @param {boolean} success - Whether the attempt was successful
     */
    recordAttempt(success) {
        this.stats.total++;
        if (success) {
            this.stats.successful++;
        }
        this.updateDifficulty();
        this.updateDisplay();
        this.saveStats();
    }
    
    /**
     * Update difficulty based on success rate
     */
    updateDifficulty() {
        const successRate = this.getSuccessRate();
        
        if (successRate > 80) {
            this.stats.difficulty = 'hard';
        } else if (successRate < 40) {
            this.stats.difficulty = 'easy';
        } else {
            this.stats.difficulty = 'medium';
        }
    }
    
    /**
     * Get current success rate
     * @returns {number} Success rate as percentage
     */
    getSuccessRate() {
        return this.stats.total > 0 ? 
            Math.round((this.stats.successful / this.stats.total) * 100) : 0;
    }
    
    /**
     * Update the display elements
     */
    updateDisplay() {
        const elements = {
            totalAttempts: this.stats.total,
            successfulAttempts: this.stats.successful,
            successRate: this.getSuccessRate() + '%',
            currentDifficulty: this.stats.difficulty.charAt(0).toUpperCase() + this.stats.difficulty.slice(1)
        };
        
        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
    }
    
    /**
     * Reset all statistics
     */
    reset() {
        this.stats = {
            total: 0,
            successful: 0,
            startTime: Date.now(),
            difficulty: 'medium'
        };
        this.updateDisplay();
        this.saveStats();
    }
    
    /**
     * Save statistics to session storage
     */
    saveStats() {
        try {
            // Note: Using memory storage as localStorage is not supported in Claude artifacts
            this.sessionStats = { ...this.stats };
        } catch (error) {
            console.warn('Could not save stats:', error);
        }
    }
    
    /**
     * Load statistics from session storage
     */
    loadStats() {
        try {
            if (this.sessionStats) {
                this.stats = { ...this.sessionStats };
            }
        } catch (error) {
            console.warn('Could not load stats:', error);
        }
        this.updateDisplay();
    }
    
    /**
     * Get current difficulty level
     * @returns {string} Current difficulty
     */
    getDifficulty() {
        return this.stats.difficulty;
    }
}