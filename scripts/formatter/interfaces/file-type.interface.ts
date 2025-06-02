/**
 * Interface for file type configuration
 */
export interface FileType {
  /** Glob pattern to match files */
  pattern: string;

  /** Human-readable description of the file type */
  description: string;

  /** Color theme for console output */
  color: string;
}
