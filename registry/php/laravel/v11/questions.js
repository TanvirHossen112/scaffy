module.exports = [
  {
    type: 'input',
    name: 'projectName',
    message: 'Project name:',
    default: 'my-laravel-app',
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
    name: 'starterKit',
    message: 'Starter kit:',
    choices: [
      { name: 'None', value: 'none' },
      { name: 'Breeze (lightweight auth)', value: 'breeze' },
      { name: 'Jetstream (full featured auth)', value: 'jetstream' },
    ],
    default: 'none',
  },
  {
    type: 'list',
    name: 'database',
    message: 'Database:',
    choices: [
      { name: 'SQLite (default)', value: 'sqlite' },
      { name: 'MySQL', value: 'mysql' },
      { name: 'PostgreSQL', value: 'pgsql' },
      { name: 'SQL Server', value: 'sqlsrv' },
    ],
    default: 'sqlite',
  },
  {
    type: 'confirm',
    name: 'docker',
    message: 'Add Laravel Sail (Docker)?',
    default: false,
  },
];
