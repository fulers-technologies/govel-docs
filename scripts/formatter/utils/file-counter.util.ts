import glob from 'fast-glob';
import { IgnorePatternReader } from './ignore-pattern-reader.util';

/**
 * Utility for counting files matching patterns
 */
export class FileCounter {
  /**
   * Count files matching a specific pattern
   * @param pattern - Glob pattern to match files
   * @returns Promise resolving to the number of matching files
   */
  static async countFiles(pattern: string): Promise<number> {
    try {
      const ignorePatterns = IgnorePatternReader.getIgnorePatterns();
      const files = await glob(pattern, { ignore: ignorePatterns });
      return files.length;
    } catch (error) {
      // If glob fails, return 0 instead of throwing
      return 0;
    }
  }

  /**
   * Count files for multiple patterns
   * @param patterns - Array of glob patterns
   * @returns Promise resolving to total count across all patterns
   */
  static async countMultiplePatterns(patterns: string[]): Promise<number> {
    const counts = await Promise.all(patterns.map(pattern => this.countFiles(pattern)));
    return counts.reduce((total, count) => total + count, 0);
  }

  /**
   * Get detailed file counts for multiple patterns
   * @param patterns - Array of glob patterns with descriptions
   * @returns Promise resolving to array of pattern counts
   */
  static async getDetailedCounts(
    patterns: Array<{ pattern: string; description: string }>
  ): Promise<Array<{ pattern: string; description: string; count: number }>> {
    const results = await Promise.all(
      patterns.map(async ({ pattern, description }) => ({
        pattern,
        description,
        count: await this.countFiles(pattern),
      }))
    );
    return results;
  }

  /**
   * Get the ignore patterns being used
   * @returns Array of ignore patterns
   */
  static getIgnorePatterns(): string[] {
    return IgnorePatternReader.getIgnorePatterns();
  }

  /**
   * Check if using .prettierignore or default patterns
   * @returns Boolean indicating if .prettierignore is being used
   */
  static isUsingPrettierIgnore(): boolean {
    return IgnorePatternReader.hasPrettierIgnore();
  }
}
