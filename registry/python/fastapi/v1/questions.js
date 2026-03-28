export default [
  {
    type: 'select',
    name: 'database',
    message: 'Database?',
    choices: [
      { name: 'None', value: 'none' },
      { name: 'PostgreSQL — SQLAlchemy + Alembic', value: 'postgresql' },
      { name: 'MySQL     — SQLAlchemy + Alembic', value: 'mysql' },
      { name: 'SQLite    — SQLAlchemy + Alembic', value: 'sqlite' },
    ],
  },
  {
    type: 'confirm',
    name: 'async',
    message: 'Use async database drivers?',
    default: true,
  },
  {
    type: 'confirm',
    name: 'docker',
    message: 'Include Docker config?',
    default: false,
  },
];
