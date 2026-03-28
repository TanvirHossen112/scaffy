export default [
  {
    type: 'select',
    name: 'database',
    message: 'Database?',
    choices: [
      { name: 'MySQL', value: 'mysql' },
      { name: 'PostgreSQL', value: 'postgresql' },
      { name: 'SQLite', value: 'sqlite' },
      { name: 'None', value: 'none' },
    ],
  },
  {
    type: 'confirm',
    name: 'docker',
    message: 'Include Docker config?',
    default: false,
  },
];
