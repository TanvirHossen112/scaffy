export default [
  {
    type: 'select',
    name: 'starterKit',
    message: 'Starter kit?',
    choices: [
      { name: 'None', value: 'none' },
      { name: 'Breeze', value: 'breeze' },
      { name: 'Jetstream', value: 'jetstream' },
    ],
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
  },
  {
    type: 'confirm',
    name: 'docker',
    message: 'Include Docker config (Laravel Sail)?',
    default: false,
  },
];
