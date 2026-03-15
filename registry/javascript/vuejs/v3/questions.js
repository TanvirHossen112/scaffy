module.exports = [
  {
    type: 'input',
    name: 'projectName',
    message: 'Project name:',
    default: 'my-vue-app',
    validate: input => {
      if (!input.trim()) return 'Project name is required';
      if (!/^[a-z0-9-_]+$/.test(input)) {
        return 'Only lowercase letters, numbers, hyphens and underscores';
      }
      return true;
    },
  },
  {
    type: 'list',
    name: 'packageManager',
    message: 'Package manager:',
    choices: [
      { name: 'npm', value: 'npm' },
      { name: 'yarn', value: 'yarn' },
      { name: 'pnpm', value: 'pnpm' },
    ],
    default: 'npm',
  },
  {
    type: 'confirm',
    name: 'router',
    message: 'Add Vue Router?',
    default: true,
  },
  {
    type: 'confirm',
    name: 'pinia',
    message: 'Add Pinia (state management)?',
    default: true,
  },
  {
    type: 'confirm',
    name: 'vitest',
    message: 'Add Vitest (unit testing)?',
    default: false,
  },
  {
    type: 'confirm',
    name: 'typescript',
    message: 'Add TypeScript?',
    default: false,
  },
  {
    type: 'confirm',
    name: 'eslint',
    message: 'Add ESLint?',
    default: true,
  },
];
