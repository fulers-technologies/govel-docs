# Go Framework - Commit System Documentation

This document describes the robust commit system implemented in the Go Framework
project, which enforces conventional commits and maintains code quality through
automated checks.

## 🚀 Quick Start

### Installation

1. **Install Node.js dependencies:**

   ```bash
   npm install
   ```

2. **Initialize Husky:**

   ```bash
   npm run prepare
   ```

3. **Initialize Git repository (if not already done):**
   ```bash
   git init
   ```

### Making Your First Commit

Use the interactive commit tool for guided commit message creation:

```bash
npm run commit
```

Or commit manually following conventional commit format:

```bash
git add .
git commit -m "feat(auth): add user authentication system"
```

## 📋 Commit Message Format

This project follows the
[Conventional Commits](https://conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Commit Types

| Type       | Description                                                   | Changelog Section        |
| ---------- | ------------------------------------------------------------- | ------------------------ |
| `feat`     | A new feature                                                 | Features                 |
| `fix`      | A bug fix                                                     | Bug Fixes                |
| `docs`     | Documentation only changes                                    | Documentation            |
| `style`    | Changes that do not affect the meaning of the code            | Hidden                   |
| `refactor` | A code change that neither fixes a bug nor adds a feature     | Code Refactoring         |
| `perf`     | A code change that improves performance                       | Performance Improvements |
| `test`     | Adding missing tests or correcting existing tests             | Hidden                   |
| `build`    | Changes that affect the build system or external dependencies | Build System             |
| `ci`       | Changes to CI configuration files and scripts                 | Hidden                   |
| `chore`    | Other changes that don't modify src or test files             | Hidden                   |
| `revert`   | Reverts a previous commit                                     | Reverts                  |
| `deps`     | Dependency updates                                            | Dependencies             |
| `security` | Security fixes                                                | Security                 |
| `i18n`     | Internationalization and localization                         | Internationalization     |
| `config`   | Configuration changes                                         | Hidden                   |
| `wip`      | Work in progress                                              | Hidden                   |

### Scopes

Available scopes correspond to the package names in the framework:

- **Core Packages**: `application`, `auth`, `broadcasting`, `bus`, `cache`,
  `collections`, `concurrency`, `conditionable`, `config`, `console`,
  `container`, `contracts`, `cookie`, `database`, `debug`, `discovery`,
  `encryption`, `events`, `exceptions`, `filesystem`, `foundation`, `harbinger`,
  `hashing`, `http`, `ignition`, `logger`, `macroable`, `mail`, `microservices`,
  `middleware`, `notifications`, `pagination`, `parser`, `pipeline`, `pipes`,
  `process`, `queue`, `redis`, `reflection`, `routing`, `session`, `support`,
  `testing`, `translation`, `validation`, `view`, `webserver`

- **General Scopes**: `deps`, `ci`, `docs`, `tests`, `build`, `release`,
  `security`, `performance`, `accessibility`, `seo`, `analytics`, `monitoring`,
  `logging`, `error-handling`, `validation`, `formatting`, `linting`

### Examples

```bash
# Feature addition
feat(auth): add JWT token validation

# Bug fix
fix(http): resolve connection timeout issue

# Documentation update
docs: update installation instructions

# Dependency update
deps: upgrade Go to version 1.21

# Breaking change
feat(database)!: change connection interface

BREAKING CHANGE: The database connection interface has been updated.
Old connect() method is replaced with connectWithOptions().
```

## 🔧 Available Scripts

### Commit and Release

| Script                  | Description                                    |
| ----------------------- | ---------------------------------------------- |
| `npm run commit`        | Interactive commit message builder             |
| `npm run release`       | Create a new release with automatic versioning |
| `npm run release:patch` | Create a patch release (1.0.0 → 1.0.1)         |
| `npm run release:minor` | Create a minor release (1.0.0 → 1.1.0)         |
| `npm run release:major` | Create a major release (1.0.0 → 2.0.0)         |
| `npm run changelog`     | Generate changelog from commits                |

### Formatting

| Script                    | Description                        |
| ------------------------- | ---------------------------------- |
| `npm run format:all`      | Format all supported file types    |
| `npm run format:json`     | Format JSON files                  |
| `npm run format:yaml`     | Format YAML files                  |
| `npm run format:html`     | Format HTML files                  |
| `npm run format:jsx`      | Format JSX/TSX files               |
| `npm run format:js`       | Format JavaScript/TypeScript files |
| `npm run format:css`      | Format CSS/SCSS/SASS/Less files    |
| `npm run format:md`       | Format Markdown files              |
| `npm run format:go`       | Format Go files                    |
| `npm run format:complete` | Format all files including Go      |

### Linting and Validation

| Script                  | Description                           |
| ----------------------- | ------------------------------------- |
| `npm run lint:commit`   | Validate last commit message          |
| `npm run lint:all`      | Run all linting checks                |
| `npm run lint:prettier` | Check code formatting                 |
| `npm run lint:go`       | Run Go linting                        |
| `npm run check:format`  | Check if files are properly formatted |
| `npm run fix:all`       | Auto-fix all linting issues           |

### Utilities

| Script                | Description                      |
| --------------------- | -------------------------------- |
| `npm run clean:all`   | Clean all cache and dependencies |
| `npm run validate`    | Validate commit message format   |
| `npm run test:commit` | Test commit message validation   |

## 🎯 Git Hooks

The project uses [Husky](https://typicode.github.io/husky/) to manage Git hooks:

### Pre-commit Hook

Runs automatically before each commit:

- ✅ Formats and lints staged files
- ✅ Checks code formatting
- ✅ Runs Go vet and tests
- ✅ Validates file sizes (prevents large files)
- ✅ Basic security check for potential secrets

### Commit-msg Hook

Validates commit messages:

- ✅ Enforces conventional commit format
- ✅ Validates commit types and scopes
- ✅ Provides helpful error messages and examples

### Pre-push Hook

Runs before pushing to remote:

- ✅ Prevents direct pushes to main/master branch
- ✅ Runs comprehensive test suite
- ✅ Checks test coverage
- ✅ Validates code quality
- ✅ Warns about TODO/FIXME comments
- ✅ Checks for debug statements
- ✅ Validates package.json sync
- ✅ Checks for merge conflict markers

## 📁 Configuration Files

| File                    | Purpose                           |
| ----------------------- | --------------------------------- |
| `package.json`          | NPM configuration and scripts     |
| `commitlint.config.js`  | Commit message validation rules   |
| `.prettierrc.json`      | Code formatting configuration     |
| `.prettierignore`       | Files to ignore during formatting |
| `lint-staged.config.js` | Pre-commit file processing        |
| `.czrc`                 | Commitizen configuration          |
| `.versionrc.json`       | Standard-version configuration    |
| `.editorconfig`         | Editor configuration              |
| `.husky/`               | Git hooks directory               |

## 🛠️ Customization

### Adding New Commit Types

1. Update `commitlint.config.js`:

   ```javascript
   'type-enum': [2, 'always', ['feat', 'fix', 'your-new-type']]
   ```

2. Update `.czrc`:

   ```json
   "types": {
     "your-new-type": {
       "description": "Your description",
       "title": "Your Title"
     }
   }
   ```

3. Update `.versionrc.json` for changelog generation.

### Adding New Scopes

Update the `scope-enum` rule in `commitlint.config.js`:

```javascript
'scope-enum': [2, 'always', ['existing-scopes', 'your-new-scope']]
```

### Modifying Formatting Rules

Edit `.prettierrc.json` to customize formatting rules for different file types.

### Customizing Git Hooks

Modify files in `.husky/` directory to customize pre-commit, commit-msg, and
pre-push behaviors.

## 🚨 Troubleshooting

### Common Issues

1. **Commit message validation fails:**

   - Use `npm run commit` for guided commit creation
   - Check the commit message format against examples above

2. **Pre-commit hook fails:**

   - Run `npm run format:all` to fix formatting issues
   - Run `npm run lint:all` to check for linting errors
   - Ensure all tests pass with `go test ./...`

3. **Husky hooks not working:**

   - Run `npm run prepare` to reinstall hooks
   - Check that `.husky/` files are executable

4. **Formatting issues:**
   - Run `npm run format:complete` to format all files
   - Check `.prettierignore` if files are being skipped

### Getting Help

- Check the commit message format examples above
- Use `npm run commit` for interactive commit creation
- Review the error messages from failed hooks
- Ensure all dependencies are installed with `npm install`

## 📚 Additional Resources

- [Conventional Commits](https://conventionalcommits.org/)
- [Commitizen](https://github.com/commitizen/cz-cli)
- [Husky](https://typicode.github.io/husky/)
- [Prettier](https://prettier.io/)
- [Standard Version](https://github.com/conventional-changelog/standard-version)

## 🤝 Contributing

When contributing to this project:

1. Follow the conventional commit format
2. Use `npm run commit` for guided commit creation
3. Ensure all pre-commit checks pass
4. Write meaningful commit messages
5. Keep commits focused and atomic
6. Update documentation when needed

## 📄 License

This commit system configuration is part of the Go Framework project and follows
the same license terms.
