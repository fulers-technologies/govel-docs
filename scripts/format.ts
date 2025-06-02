#!/usr/bin/env tsx

/**
 * Format Script Entry Point
 *
 * This script imports and runs the modular Formatter
 * using the static factory method for cleaner instantiation
 */

import path from 'path';
import { fileURLToPath } from 'url';
import { Formatter } from './formatter';

/**
 * Main execution function
 */
async function main(): Promise<void> {
  const formatter = Formatter.make();
  await formatter.run();
}

// ESM equivalent for: if (require.main === module)
// Get the path of the current module
const currentModulePath = path.resolve(fileURLToPath(import.meta.url));

// Get the path of the script that was executed
const mainScriptPath = path.resolve(process.argv[1]);

if (currentModulePath === mainScriptPath) {
  main().catch(error => {
    console.error('❌ Formatter execution failed:', error.message);
    process.exit(1);
  });
}
