const { v4: uuidv4 } = require('uuid');

class CodeGenerator {
    constructor() {
        // Characters to use in redemption codes (excluding confusing ones like I, O, 0, 1)
        this.characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        this.codeLength = 16; // Total length of code
        this.groupSize = 4; // Size of each group
        this.separator = '-'; // Separator between groups
    }

    /**
     * Generate a random redemption code
     * Format: XXXX-XXXX-XXXX-XXXX
     */
    generateCode() {
        const groups = [];
        const numGroups = Math.ceil(this.codeLength / this.groupSize);
        
        for (let g = 0; g < numGroups; g++) {
            let group = '';
            for (let i = 0; i < this.groupSize; i++) {
                const randomIndex = Math.floor(Math.random() * this.characters.length);
                group += this.characters[randomIndex];
            }
            groups.push(group);
        }
        
        return groups.join(this.separator);
    }

    /**
     * Generate a unique transaction ID
     */
    generateTransactionId() {
        return `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    }

    /**
     * Generate a short reference code
     */
    generateReferenceCode(length = 8) {
        let code = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * this.characters.length);
            code += this.characters[randomIndex];
        }
        return code;
    }

    /**
     * Validate a redemption code format
     */
    validateCodeFormat(code) {
        if (!code || typeof code !== 'string') {
            return false;
        }

        // Remove any whitespace
        const cleanCode = code.trim().toUpperCase();
        
        // Check if it matches the expected format (XXXX-XXXX-XXXX-XXXX)
        const pattern = new RegExp(`^([${this.characters}]{${this.groupSize}}${this.separator}){3}[${this.characters}]{${this.groupSize}}$`);
        
        return pattern.test(cleanCode);
    }

    /**
     * Generate a batch of unique codes
     */
    generateBatch(count = 10) {
        const codes = new Set();
        
        while (codes.size < count) {
            codes.add(this.generateCode());
        }
        
        return Array.from(codes);
    }

    /**
     * Generate a code with custom parameters
     */
    generateCustomCode(options = {}) {
        const {
            length = this.codeLength,
            groupSize = this.groupSize,
            separator = this.separator,
            prefix = '',
            suffix = ''
        } = options;

        const groups = [];
        const numGroups = Math.ceil(length / groupSize);
        
        for (let g = 0; g < numGroups; g++) {
            let group = '';
            const currentGroupSize = (g === numGroups - 1) ? length % groupSize || groupSize : groupSize;
            
            for (let i = 0; i < currentGroupSize; i++) {
                const randomIndex = Math.floor(Math.random() * this.characters.length);
                group += this.characters[randomIndex];
            }
            groups.push(group);
        }
        
        const code = groups.join(separator);
        return `${prefix}${code}${suffix}`;
    }

    /**
     * Generate a UUID-based code (alternative method)
     */
    generateUUIDCode() {
        return uuidv4().toUpperCase().replace(/-/g, '');
    }

    /**
     * Generate a time-based code
     */
    generateTimeBasedCode() {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        return `${timestamp}-${random}`;
    }

    /**
     * Generate a code with checksum for validation
     */
    generateCodeWithChecksum() {
        const baseCode = this.generateCode();
        const checksum = this.calculateChecksum(baseCode);
        return `${baseCode}-${checksum}`;
    }

    /**
     * Calculate a simple checksum for a code
     */
    calculateChecksum(code) {
        let sum = 0;
        for (let i = 0; i < code.length; i++) {
            const char = code.charAt(i);
            if (char !== this.separator) {
                sum += this.characters.indexOf(char) + 1;
            }
        }
        
        const checksumIndex = sum % this.characters.length;
        return this.characters[checksumIndex];
    }

    /**
     * Validate a code with checksum
     */
    validateCodeWithChecksum(codeWithChecksum) {
        const parts = codeWithChecksum.split(this.separator);
        if (parts.length !== 5) { // 4 groups + 1 checksum
            return false;
        }

        const checksum = parts.pop();
        const baseCode = parts.join(this.separator);
        const expectedChecksum = this.calculateChecksum(baseCode);
        
        return checksum === expectedChecksum && this.validateCodeFormat(baseCode);
    }

    /**
     * Generate a human-readable code (easier to type/remember)
     */
    generateHumanReadableCode() {
        // Use only uppercase letters and exclude confusing characters
        const humanChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
        const groups = [];
        
        for (let g = 0; g < 4; g++) {
            let group = '';
            for (let i = 0; i < 4; i++) {
                const randomIndex = Math.floor(Math.random() * humanChars.length);
                group += humanChars[randomIndex];
            }
            groups.push(group);
        }
        
        return groups.join(this.separator);
    }

    /**
     * Generate statistics about code generation
     */
    getStatistics() {
        const totalPossibleCodes = Math.pow(this.characters.length, this.codeLength);
        const codesPerGroup = Math.pow(this.characters.length, this.groupSize);
        
        return {
            characterSet: this.characters,
            characterCount: this.characters.length,
            codeLength: this.codeLength,
            groupSize: this.groupSize,
            totalGroups: Math.ceil(this.codeLength / this.groupSize),
            codesPerGroup: codesPerGroup,
            totalPossibleCodes: totalPossibleCodes,
            collisionProbability: 1 / totalPossibleCodes
        };
    }
}

module.exports = CodeGenerator;
