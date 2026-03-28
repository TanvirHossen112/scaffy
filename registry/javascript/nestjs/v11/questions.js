import { detectAvailableChoices } from '../../../../core/detector.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pluginMeta = require('../plugin.json');

export default async () => {
  const availableManagers = await detectAvailableChoices(
    pluginMeta.packageManagerQuestion.choices
  );

  return [
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
      type: 'select',
      name: 'packageManager',
      message: pluginMeta.packageManagerQuestion.message,
      choices: availableManagers.map(m => ({
        name: m.name,
        value: m.value,
      })),
      default: availableManagers[0].value,
    },
    {
      type: 'select',
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
};
