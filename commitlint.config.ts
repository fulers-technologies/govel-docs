import type { UserConfig } from '@commitlint/types';

const config: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // ✨ A new feature
        'fix', // 🐛 A bug fix
        'docs', // 📚 Documentation only changes
        'style', // 💄 Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
        'refactor', // ♻️ A code change that neither fixes a bug nor adds a feature
        'perf', // ⚡️ A code change that improves performance
        'test', // ✅ Adding missing tests or correcting existing tests
        'build', // 👷 Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
        'ci', // 💚 Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
        'chore', // 🔧 Other changes that don't modify src or test files
        'revert', // ⏪ Reverts a previous commit
        'wip', // 🚧 Work in progress
        'deps', // ⬆️ Dependency updates
        'security', // 🔒 Security fixes
        'i18n', // 🌐 Internationalization and localization
        'config', // ⚙️ Configuration changes
        'release', // 🚀 Release commits
      ],
    ],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'scope-case': [2, 'always', 'lower-case'],
    'scope-enum': [
      2,
      'always',
      [
        // Package scopes
        'application',
        'auth',
        'broadcasting',
        'bus',
        'cache',
        'collections',
        'concurrency',
        'conditionable',
        'config',
        'console',
        'container',
        'contracts',
        'cookie',
        'database',
        'debug',
        'discovery',
        'encryption',
        'events',
        'exceptions',
        'filesystem',
        'foundation',
        'harbinger',
        'hashing',
        'http',
        'ignition',
        'logger',
        'macroable',
        'mail',
        'microservices',
        'middleware',
        'notifications',
        'pagination',
        'parser',
        'pipeline',
        'pipes',
        'process',
        'queue',
        'redis',
        'reflection',
        'routing',
        'session',
        'support',
        'testing',
        'translation',
        'validation',
        'view',
        'webserver',
        // General scopes
        'deps',
        'ci',
        'docs',
        'tests',
        'build',
        'release',
        'security',
        'performance',
        'accessibility',
        'seo',
        'analytics',
        'monitoring',
        'logging',
        'error-handling',
        'validation',
        'formatting',
        'linting',
      ],
    ],
    'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 100],
    'body-leading-blank': [1, 'always'],
    'body-max-line-length': [2, 'always', 100],
    'footer-leading-blank': [1, 'always'],
    'footer-max-line-length': [2, 'always', 100],
    'references-empty': [1, 'never'],
  },
  prompt: {
    questions: {
      type: {
        description: "Select the type of change that you're committing:",
        enum: {
          feat: {
            description: '✨ A new feature',
            title: 'Features',
            emoji: '✨',
          },
          fix: {
            description: '🐛 A bug fix',
            title: 'Bug Fixes',
            emoji: '🐛',
          },
          docs: {
            description: '📚 Documentation only changes',
            title: 'Documentation',
            emoji: '📚',
          },
          style: {
            description:
              '💄 Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)',
            title: 'Styles',
            emoji: '💄',
          },
          refactor: {
            description: '♻️ A code change that neither fixes a bug nor adds a feature',
            title: 'Code Refactoring',
            emoji: '♻️',
          },
          perf: {
            description: '⚡️ A code change that improves performance',
            title: 'Performance Improvements',
            emoji: '⚡️',
          },
          test: {
            description: '✅ Adding missing tests or correcting existing tests',
            title: 'Tests',
            emoji: '✅',
          },
          build: {
            description:
              '👷 Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)',
            title: 'Builds',
            emoji: '👷',
          },
          ci: {
            description:
              '💚 Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)',
            title: 'Continuous Integrations',
            emoji: '💚',
          },
          chore: {
            description: "🔧 Other changes that don't modify src or test files",
            title: 'Chores',
            emoji: '🔧',
          },
          revert: {
            description: '⏪ Reverts a previous commit',
            title: 'Reverts',
            emoji: '⏪',
          },
          wip: {
            description: '🚧 Work in progress',
            title: 'Work in Progress',
            emoji: '🚧',
          },
          deps: {
            description: '⬆️ Dependency updates',
            title: 'Dependencies',
            emoji: '⬆️',
          },
          security: {
            description: '🔒 Security fixes',
            title: 'Security',
            emoji: '🔒',
          },
          i18n: {
            description: '🌐 Internationalization and localization',
            title: 'Internationalization',
            emoji: '🌐',
          },
          config: {
            description: '⚙️ Configuration changes',
            title: 'Configuration',
            emoji: '⚙️',
          },
          release: {
            description: '🚀 Release commits',
            title: 'Releases',
            emoji: '🚀',
          },
        },
      },
      scope: {
        description: 'What is the scope of this change (e.g. component or file name)',
      },
      subject: {
        description: 'Write a short, imperative tense description of the change',
      },
      body: {
        description: 'Provide a longer description of the change',
      },
      isBreaking: {
        description: 'Are there any breaking changes?',
      },
      breakingBody: {
        description:
          'A BREAKING CHANGE commit requires a body. Please enter a longer description of the commit itself',
      },
      breaking: {
        description: 'Describe the breaking changes',
      },
      isIssueAffected: {
        description: 'Does this change affect any open issues?',
      },
      issuesBody: {
        description:
          'If issues are closed, the commit requires a body. Please enter a longer description of the commit itself',
      },
      issues: {
        description: 'Add issue references (e.g. "fix #123", "re #123".)',
      },
    },
  },
};

export default config;
