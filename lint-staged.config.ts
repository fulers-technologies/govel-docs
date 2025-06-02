import type { Config } from 'lint-staged';

const config: Config = {
  // JavaScript and TypeScript files
  '*.{js,jsx,ts,tsx}': ['prettier --write', 'eslint --fix --max-warnings=0', 'git add'],

  // JSON files
  '*.json': ['prettier --write', 'git add'],

  // YAML files
  '*.{yml,yaml}': ['prettier --write', 'git add'],

  // HTML files
  '*.html': ['prettier --write', 'git add'],

  // CSS and styling files
  '*.{css,scss,sass,less}': ['prettier --write', 'stylelint --fix', 'git add'],

  // Markdown files
  '*.{md,mdx}': ['prettier --write', 'markdownlint --fix', 'git add'],

  // XML files
  '*.xml': ['prettier --write', 'git add'],

  // Vue files
  '*.vue': ['prettier --write', 'eslint --fix --max-warnings=0', 'git add'],

  // Svelte files
  '*.svelte': ['prettier --write', 'eslint --fix --max-warnings=0', 'git add'],

  // Go files
  '*.go': ['gofmt -w', 'goimports -w', 'go vet', 'golangci-lint run --fix', 'git add'],

  // TOML files
  '*.toml': ['prettier --write', 'git add'],

  // Configuration files
  '*.{ini,conf,config}': ['prettier --write', 'git add'],

  // Properties files
  '*.properties': ['prettier --write', 'git add'],

  // Shell scripts
  '*.{sh,bash,zsh}': ['shellcheck', 'shfmt -w', 'git add'],

  // Dockerfile
  'Dockerfile*': ['hadolint', 'git add'],

  // Docker Compose files
  'docker-compose*.{yml,yaml}': ['prettier --write', 'git add'],

  // Package files
  'package.json': ['prettier --write', 'sort-package-json', 'git add'],

  // Lock files (don't format, just add)
  '*.lock': ['git add'],

  // Terraform files
  '*.{tf,tfvars}': ['terraform fmt', 'git add'],

  // Python files (if any)
  '*.py': ['black', 'isort', 'flake8', 'git add'],

  // Ruby files (if any)
  '*.rb': ['rubocop --auto-correct', 'git add'],

  // PHP files (if any)
  '*.php': ['php-cs-fixer fix', 'git add'],

  // Rust files (if any)
  '*.rs': ['rustfmt', 'git add'],

  // C/C++ files (if any)
  '*.{c,cpp,h,hpp}': ['clang-format -i', 'git add'],

  // Java files (if any)
  '*.java': ['google-java-format --replace', 'git add'],

  // SQL files
  '*.sql': ['sql-formatter --fix', 'git add'],

  // GraphQL files
  '*.{graphql,gql}': ['prettier --write', 'git add'],

  // Protocol Buffer files
  '*.proto': ['buf format -w', 'git add'],
};

export default config;
