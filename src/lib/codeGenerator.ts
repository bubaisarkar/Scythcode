export class CodeGenerator {
  private characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  private codeLength = 16;
  private groupSize = 4;
  private separator = '-';

  /**
   * Generate a random redemption code
   * Format: XXXX-XXXX-XXXX-XXXX
   */
  generateCode(): string {
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
   * Validate a redemption code format
   */
  validateCodeFormat(code: string): boolean {
    if (!code || typeof code !== 'string') {
      return false;
    }

    const cleanCode = code.trim().toUpperCase();
    const pattern = new RegExp(`^([${this.characters}]{${this.groupSize}}${this.separator}){3}[${this.characters}]{${this.groupSize}}$`);
    
    return pattern.test(cleanCode);
  }
}
