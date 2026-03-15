module.exports = [
  {
    type: 'input',
    name: 'projectName',
    message: 'Project name:',
    default: 'my-nest-app',
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
    type: 'list',
    name: 'database',
    message: 'Database:',
    choices: [
      { name: 'None', value: 'none' },
      { name: 'PostgreSQL (TypeORM)', value: 'postgres' },
      { name: 'MySQL (TypeORM)', value: 'mysql' },
      { name: 'MongoDB (Mongoose)', value: 'mongodb' },
      { name: 'SQLite (TypeORM)', value: 'sqlite' },
    ],
    default: 'none',
  },
  {
    type: 'confirm',
    name: 'auth',
    message: 'Add JWT authentication (Passport)?',
    default: false,
  },
  {
    type: 'confirm',
    name: 'docker',
    message: 'Add Dockerfile?',
    default: false,
  },
];
