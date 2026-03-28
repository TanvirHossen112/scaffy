export default [
  {
    type: 'input',
    name: 'projectName',
    message: 'Project name?',
    default: 'my-laravel-app',
    validate: value => {
      if (!value || !value.trim()) {
        return 'Project name is required';
      }
      if (!/^[a-z0-9_-]+$/.test(value)) {
        return 'Project name can only contain lowercase letters, numbers, underscores, and hyphens';
      }
      return true;
    },
  },
  {
    type: 'select',
    name: 'starterKit',
    message: 'Starter kit?',
    choices: [
      { name: 'None', value: 'none' },
      { name: 'Breeze', value: 'breeze' },
      { name: 'Jetstream', value: 'jetstream' },
    ],
    default: 'none',
  },
  {
    type: 'select',
    name: 'database',
    message: 'Database?',
    choices: [
      { name: 'SQLite', value: 'sqlite' },
      { name: 'MySQL', value: 'mysql' },
      { name: 'PostgreSQL', value: 'pgsql' },
    ],
    default: 'sqlite',
  },
  {
    type: 'confirm',
    name: 'docker',
    message: 'Include Docker config (Laravel Sail)?',
    default: false,
  },
];
