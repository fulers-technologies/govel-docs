/**
 * Interface for formatter statistics tracking
 */
export interface FormatterStats {
  /** Total number of files processed */
  totalFiles: number;

  /** Total duration of all operations in milliseconds */
  totalDuration: number;

  /** Number of successful operations */
  successCount: number;

  /** Number of operations with errors */
  errorCount: number;

  /** Number of skipped file types (no files found) */
  skippedCount: number;
}
