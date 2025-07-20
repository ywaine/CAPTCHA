/**
 * Utility functions for CAPTCHA system
 */

class CaptchaUtils {
    static characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    static fonts = ['Arial', 'Helvetica', 'Times', 'Courier', 'Verdana'];
    static colors = ['#FF0000', '#00FF00', '#0000FF', '#FF00FF', '#FFFF00', '#00FFFF', '#FF8000', '#8000FF'];
    
    /**
     * Generate a random string of specified length
     * @param {number} length - Length of the string to generate
     * @returns {string} Random string
     */
    static generateRandomString(length = 5) {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += this.characters.charAt(Math.floor(Math.random() * this.characters.length));
        }
        return result;
    }
    
    /**
     * Get a random color with specified alpha
     * @param {number} alpha - Alpha value (0-1)
     * @returns {string} RGBA color string
     */
    static getRandomColor(alpha = 1) {
        const color = this.colors[Math.floor(Math.random() * this.colors.length)];
        const r = parseInt(color.substr(1, 2), 16);
        const g = parseInt(color.substr(3, 2), 16);
        const b = parseInt(color.substr(5, 2), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    
    /**
     * Get a random font from the available fonts
     * @returns {string} Font name
     */
    static getRandomFont() {
        return this.fonts[Math.floor(Math.random() * this.fonts.length)];
    }
    
    /**
     * Generate a random number between min and max
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} Random number
     */
    static randomBetween(min, max) {
        return Math.random() * (max - min) + min;
    }
    
    /**
     * Debounce function to limit function calls
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    static debounce(func, wait) {
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
    
    /**
     * Validate input string
     * @param {string} input - Input to validate
     * @returns {boolean} True if valid
     */
    static isValidInput(input) {
        return /^[A-Z0-9]+$/.test(input);
    }
}