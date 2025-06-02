import chalk from 'chalk';
import cliProgress from 'cli-progress';
import ora from 'ora';

import { FILE_TYPES } from './constants/file-types.constant';
import type { FileType, FormatterStats } from './interfaces';
import { FileCounter, FileFormatter, IgnorePatternReader, logger, timestamp } from './utils';

/**
 * Professional Code Formatter
 * Features: Single progress bar, beautiful spinners, TypeScript, proper error handling
 */
export class Formatter {
  private progressBar: cliProgress.SingleBar;
  private stats: FormatterStats = {
    totalFiles: 0,
    totalDuration: 0,
    successCount: 0,
    errorCount: 0,
    skippedCount: 0,
  };
  private accumulatedLogMessages: string[] = []; // Added to store log messages

  constructor() {
    this.progressBar = new cliProgress.SingleBar({
      format: `${chalk.cyan('{bar}')} {percentage}% | {value}/{total} | {status}`,
      barCompleteChar: '█',
      barIncompleteChar: '░',
      hideCursor: true,
      barsize: 30,
      stopOnComplete: true,
      clearOnComplete: true, // Important: Clears the bar when it's done
    });
  }

  /**
   * Static factory method to create a new Formatter instance
   * @returns New Formatter instance
   */
  static make(): Formatter {
    return new Formatter();
  }

  /**
   * Display the formatter header
   */
  private async showHeader(): Promise<void> {
    console.clear();
    console.log(chalk.bold.cyan('\n🎨 Code Formatter v3.0'));
    console.log(chalk.cyan('='.repeat(50)));
    logger.info('Starting enhanced formatting process...');

    const usingPrettierIgnore = IgnorePatternReader.hasPrettierIgnore();
    if (usingPrettierIgnore) {
      logger.info('📋 Using ignore patterns from .prettierignore');
    } else {
      logger.info('📋 Using default ignore patterns (no .prettierignore found)');
    }

    console.log('');
  }

  /**
   * Calculate total steps for progress tracking
   */
  private async calculateTotalSteps(): Promise<number> {
    const spinner = ora('Analyzing project files...').start();

    let totalFiles = 0;
    for (const fileType of FILE_TYPES) {
      const count = await FileCounter.countFiles(fileType.pattern);
      totalFiles += count;
    }

    const goCount = await FileCounter.countFiles('*.go');
    totalFiles += goCount;

    const ignoreInfo = FileCounter.isUsingPrettierIgnore()
      ? 'respecting .prettierignore'
      : 'using default patterns';

    spinner.succeed(`Found ${totalFiles} files to process (${ignoreInfo})`);
    return FILE_TYPES.length + 1; // +1 for Go files
  }

  /**
   * Update progress bar with current status
   */
  private updateProgress(current: number, total: number, status: string): void {
    this.progressBar.update(current, { status });
  }

  /**
   * Process a specific file type
   */
  private async processFileType(
    fileType: FileType,
    stepNumber: number,
    totalSteps: number
  ): Promise<void> {
    this.updateProgress(stepNumber, totalSteps, `Processing ${fileType.description}...`);

    const result = await FileFormatter.formatWithPrettier(fileType.pattern, fileType.description);

    this.stats.totalFiles += result.count;
    this.stats.totalDuration += result.duration;

    // Accumulate messages instead of logging immediately
    if (result.count === 0) {
      this.stats.skippedCount++;
      this.accumulatedLogMessages.push(
        `${chalk.gray('⏭️')}  No ${fileType.description} files found`
      );
    } else if (result.success) {
      this.stats.successCount++;
      this.accumulatedLogMessages.push(
        `${chalk.green('✅')} ${fileType.description}: ${result.count} file(s) formatted (${result.duration.toFixed(0)}ms)`
      );
    } else {
      this.stats.errorCount++;
      this.accumulatedLogMessages.push(
        `${chalk.yellow('⚠️')}  ${fileType.description}: ${result.count} file(s) - some issues encountered`
      );
      if (result.errors) {
        result.errors.forEach(error =>
          this.accumulatedLogMessages.push(
            `${chalk.red('❌')}   Error for ${fileType.description}: ${error}`
          )
        );
      }
    }
  }

  /**
   * Process Go files
   */
  private async processGoFiles(stepNumber: number, totalSteps: number): Promise<void> {
    this.updateProgress(stepNumber, totalSteps, 'Processing Go files...');

    const result = await FileFormatter.formatGoFiles();

    this.stats.totalFiles += result.count;
    this.stats.totalDuration += result.duration;

    // Accumulate messages instead of logging immediately
    if (result.count === 0) {
      this.stats.skippedCount++;
      this.accumulatedLogMessages.push(`${chalk.gray('⏭️')}  No Go files found`);
    } else if (result.success) {
      this.stats.successCount++;
      this.accumulatedLogMessages.push(
        `${chalk.green('✅')} Go files: ${result.count} file(s) formatted (${result.duration.toFixed(0)}ms)`
      );
    } else {
      this.stats.errorCount++;
      this.accumulatedLogMessages.push(
        `${chalk.yellow('⚠️')}  Go files: ${result.count} file(s) - some issues encountered`
      );
      if (result.errors) {
        result.errors.forEach(error =>
          this.accumulatedLogMessages.push(`${chalk.red('❌')}   Error for Go files: ${error}`)
        );
      }
    }
  }

  /**
   * Display formatting summary
   */
  private showSummary(): void {
    // Print accumulated messages first
    if (this.accumulatedLogMessages.length > 0) {
      console.log('\n' + chalk.bold.cyan('📋 Detailed Log'));
      console.log(chalk.cyan('-'.repeat(50)));
      this.accumulatedLogMessages.forEach(msg => console.log(msg));
    }

    console.log('\n' + chalk.bold.cyan('📊 Formatting Summary'));
    console.log(chalk.cyan('='.repeat(50)));

    logger.info(`Total files processed: ${this.stats.totalFiles}`);
    logger.info(`Total duration: ${this.stats.totalDuration.toFixed(0)}ms`);
    logger.info(`Successful operations: ${this.stats.successCount}`);

    if (this.stats.errorCount > 0) {
      logger.warning(`Operations with issues: ${this.stats.errorCount}`);
    }

    if (this.stats.skippedCount > 0) {
      logger.info(`Skipped file types (no files found): ${this.stats.skippedCount}`);
    }

    const ignorePatterns = FileCounter.getIgnorePatterns();
    logger.info(`Ignored ${ignorePatterns.length} pattern(s) during processing`);

    console.log('');

    if (this.stats.totalFiles > 0 && this.stats.errorCount === 0) {
      logger.success('All formatting completed! Your code is now beautifully formatted ✨');
    } else if (this.stats.totalFiles > 0 && this.stats.errorCount > 0) {
      logger.warning('Formatting completed with some issues. Please review the logs. 🧐');
    } else {
      logger.info('No files found to format in this directory');
    }

    if (this.stats.totalDuration > 5000 && this.stats.totalFiles > 0) {
      logger.info(
        '💡 Tip: For faster formatting, consider optimizing your .prettierignore patterns'
      );
    }

    console.log('');
    logger.info(`Formatting session completed at ${timestamp()}`);
    console.log('');
  }

  /**
   * Run the complete formatting process
   */
  public async run(): Promise<void> {
    try {
      this.accumulatedLogMessages = []; // Reset messages for each run
      await this.showHeader();

      const totalSteps = await this.calculateTotalSteps();

      this.progressBar.start(totalSteps, 0, { status: 'Initializing...' });

      for (let i = 0; i < FILE_TYPES.length; i++) {
        await this.processFileType(FILE_TYPES[i], i + 1, totalSteps);
      }

      await this.processGoFiles(totalSteps, totalSteps);

      // Progress bar will stop and clear automatically due to constructor options
      // (stopOnComplete: true, clearOnComplete: true)
      // Explicitly calling stop() here ensures it stops if not 100% for some reason,
      // though clearOnComplete might only trigger if it reached 100%.
      // If the bar is not clearing, ensure it reaches its total value.
      this.progressBar.update(totalSteps, { status: 'Finalizing...' }); // Ensure it reaches total
      this.progressBar.stop();

      this.showSummary();
    } catch (error: any) {
      // Ensure bar is stopped (and hopefully cleared) on error
      if (this.progressBar) {
        // Check if progressBar was initialized
        this.progressBar.stop();
      }
      logger.error(`Formatting failed: ${error.message}`);
      // Log accumulated messages if any, before exiting
      if (this.accumulatedLogMessages.length > 0) {
        console.log('\n' + chalk.bold.cyan('📋 Partial Log Before Error:'));
        console.log(chalk.cyan('-'.repeat(50)));
        this.accumulatedLogMessages.forEach(msg => console.log(msg));
      }
      process.exit(1);
    }
  }
}
