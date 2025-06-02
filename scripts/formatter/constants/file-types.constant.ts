import { FileType } from '../interfaces';

/**
 * Configuration for supported file types
 */
export const FILE_TYPES: FileType[] = [
  { pattern: '*.json', description: 'JSON', color: 'yellow' },
  { pattern: '*.{yml,yaml}', description: 'YAML', color: 'blue' },
  { pattern: '*.html', description: 'HTML', color: 'orange' },
  { pattern: '*.{jsx,tsx}', description: 'JSX/TSX', color: 'cyan' },
  { pattern: '*.{js,ts}', description: 'JavaScript/TypeScript', color: 'green' },
  { pattern: '*.{css,scss,sass,less}', description: 'CSS/Sass', color: 'magenta' },
  { pattern: '*.{md,mdx}', description: 'Markdown', color: 'white' },
  { pattern: '*.xml', description: 'XML', color: 'gray' },
  { pattern: '*.vue', description: 'Vue', color: 'green' },
  { pattern: '*.svelte', description: 'Svelte', color: 'red' },
];
