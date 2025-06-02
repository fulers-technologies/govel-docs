import chalk from 'chalk';

/**
 * Utility function to get current timestamp
 */
const timestamp = (): string => new Date().toLocaleTimeString('en-US', { hour12: false });

/**
 * Logger utility with colored output and timestamps
 */
export const logger = {
  /**
   * Log an informational message
   */
  info: (msg: string): void => {
    console.log(`${chalk.dim(`[${timestamp()}]`)} ${chalk.blue('ℹ')}  ${msg}`);
  },

  /**
   * Log a success message
   */
  success: (msg: string): void => {
    console.log(`${chalk.dim(`[${timestamp()}]`)} ${chalk.green('✅')} ${msg}`);
  },

  /**
   * Log a warning message
   */
  warning: (msg: string): void => {
    console.log(`${chalk.dim(`[${timestamp()}]`)} ${chalk.yellow('⚠️')}  ${msg}`);
  },

  /**
   * Log an error message
   */
  error: (msg: string): void => {
    console.log(`${chalk.dim(`[${timestamp()}]`)} ${chalk.red('❌')} ${msg}`);
  },

  /**
   * Log a skip message
   */
  skip: (msg: string): void => {
    console.log(`${chalk.dim(`[${timestamp()}]`)} ${chalk.gray('⏭️')}  ${msg}`);
  },

  /**
   * Log a process message
   */
  process: (msg: string): void => {
    console.log(`${chalk.dim(`[${timestamp()}]`)} ${chalk.magenta('🔄')} ${msg}`);
  }
};

/**
 * Get current timestamp string
 */
export { timestamp };

