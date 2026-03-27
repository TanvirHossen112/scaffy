export default [
  {
    type: 'list',
    name: 'database',
    message: 'Database?',
    choices: [
      { name: 'SQLite  — default, no setup needed', value: 'sqlite' },
      { name: 'PostgreSQL', value: 'postgresql' },
      { name: 'MySQL', value: 'mysql' },
    ],
  },
  {
    type: 'confirm',
    name: 'restFramework',
    message: 'Include Django REST Framework?',
    default: false,
  },
  {
    type: 'confirm',
    name: 'docker',
    message: 'Include Docker config?',
    default: false,
  },
];
