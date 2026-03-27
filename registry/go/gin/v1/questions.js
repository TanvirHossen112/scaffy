export default [
  {
    type: 'list',
    name: 'database',
    message: 'Database?',
    choices: [
      { name: 'None', value: 'none' },
      { name: 'PostgreSQL — GORM + postgres driver', value: 'postgresql' },
      { name: 'MySQL     — GORM + mysql driver', value: 'mysql' },
      { name: 'SQLite    — GORM + sqlite driver', value: 'sqlite' },
    ],
  },
  {
    type: 'confirm',
    name: 'docker',
    message: 'Include Docker config?',
    default: false,
  },
];
