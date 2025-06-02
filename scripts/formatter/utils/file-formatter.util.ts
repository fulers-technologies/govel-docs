import { execa } from 'execa';
import { performance } from 'perf_hooks';
import { FormatResult } from '../interfaces';
import { FileCounter } from './file-counter.util';

/**
 * Utility for formatting different types of files
 */
export class FileFormatter {
  /**
   * Format files using Prettier
   * @param pattern - Glob pattern for files to format
   * @param description - Human-readable description of file type
   * @returns Promise resolving to format result
   */
  static async formatWithPrettier(pattern: string, description: string): Promise<FormatResult> {
    const startTime = performance.now();
    const fileCount = await FileCounter.countFiles(pattern);

    if (fileCount === 0) {
      return {
        success: true,
        count: 0,
        duration: performance.now() - startTime,
      };
    }

    try {
      await execa('prettier', ['--write', pattern, '--ignore-unknown', '--log-level', 'warn'], {
        stdio: 'pipe',
      });

      return {
        success: true,
        count: fileCount,
        duration: performance.now() - startTime,
      };
    } catch (error: any) {
      return {
        success: false,
        count: fileCount,
        duration: performance.now() - startTime,
        errors: [error.message],
      };
    }
  }

  /**
   * Format Go files using gofmt and goimports
   * @returns Promise resolving to format result
   */
  static async formatGoFiles(): Promise<FormatResult> {
    const startTime = performance.now();
    const goCount = await FileCounter.countFiles('*.go');

    if (goCount === 0) {
      return {
        success: true,
        count: 0,
        duration: performance.now() - startTime,
      };
    }

    const errors: string[] = [];

    // Format with gofmt
    try {
      await execa(
        'find',
        ['.', '-name', '*.go', '-not', '-path', './vendor/*', '-exec', 'gofmt', '-w', '{}', '+'],
        { stdio: 'pipe' }
      );
    } catch (error: any) {
      errors.push(`gofmt: ${error.message}`);
    }

    // Try goimports if available
    try {
      await execa('which', ['goimports'], { stdio: 'pipe' });
      await execa(
        'find',
        [
          '.',
          '-name',
          '*.go',
          '-not',
          '-path',
          './vendor/*',
          '-exec',
          'goimports',
          '-w',
          '{}',
          '+',
        ],
        { stdio: 'pipe' }
      );
    } catch {
      // goimports not available, that's okay
    }

    return {
      success: errors.length === 0,
      count: goCount,
      duration: performance.now() - startTime,
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  /**
   * Check if a command is available in the system
   * @param command - Command to check
   * @returns Promise resolving to boolean indicating availability
   */
  static async isCommandAvailable(command: string): Promise<boolean> {
    try {
      await execa('which', [command], { stdio: 'pipe' });
      return true;
    } catch {
      return false;
    }
  }
}
