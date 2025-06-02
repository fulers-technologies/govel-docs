/**
 * Interface for formatting operation results
 */
export interface FormatResult {
  /** Whether the formatting operation was successful */
  success: boolean;

  /** Number of files processed */
  count: number;

  /** Duration of the operation in milliseconds */
  duration: number;

  /** Optional array of error messages if operation failed */
  errors?: string[];
}
