import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

/**
 * Default patterns to exclude from formatting if .prettierignore is not found
 */
export const DEFAULT_EXCLUDE_PATTERNS: string[] = [
  'node_modules/**',
  'vendor/**',
  '.git/**',
  'dist/**',
  'build/**',
  'coverage/**',
  '.next/**',
  '.nuxt/**',
  'out/**',
];

/**
 * Utility for reading ignore patterns
 */
export class IgnorePatternReader {
  private static cachedPatterns: string[] | null = null;

  /**
   * Read ignore patterns from .prettierignore file or use defaults
   * @param cwd - Current working directory (defaults to process.cwd())
   * @returns Array of ignore patterns
   */
  static getIgnorePatterns(cwd: string = process.cwd()): string[] {
    // Return cached patterns if already loaded
    if (this.cachedPatterns !== null) {
      return this.cachedPatterns;
    }

    const prettierIgnorePath = join(cwd, '.prettierignore');

    try {
      if (existsSync(prettierIgnorePath)) {
        const content = readFileSync(prettierIgnorePath, 'utf8');
        const patterns = content
          .split('\n')
          .map(line => line.trim())
          .filter(line => line && !line.startsWith('#')) // Remove empty lines and comments
          .map(pattern => {
            // Convert .prettierignore patterns to glob patterns
            if (!pattern.includes('*') && !pattern.endsWith('/')) {
              return `${pattern}/**`;
            }
            return pattern;
          });

        this.cachedPatterns = patterns.length > 0 ? patterns : DEFAULT_EXCLUDE_PATTERNS;
        return this.cachedPatterns;
      }
    } catch (error) {
      // If reading fails, fall back to defaults
      console.warn('⚠️  Could not read .prettierignore, using default exclude patterns');
    }

    // Use default patterns if .prettierignore doesn't exist or can't be read
    this.cachedPatterns = DEFAULT_EXCLUDE_PATTERNS;
    return this.cachedPatterns;
  }

  /**
   * Clear cached patterns (useful for testing or when .prettierignore changes)
   */
  static clearCache(): void {
    this.cachedPatterns = null;
  }

  /**
   * Check if .prettierignore file exists
   * @param cwd - Current working directory (defaults to process.cwd())
   * @returns Boolean indicating if .prettierignore exists
   */
  static hasPrettierIgnore(cwd: string = process.cwd()): boolean {
    return existsSync(join(cwd, '.prettierignore'));
  }
}
