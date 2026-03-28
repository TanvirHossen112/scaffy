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
      type: 'select',
      name: 'packageManager',
      message: pluginMeta.packageManagerQuestion.message,
      choices: availableManagers,
    },
    {
      type: 'confirm',
      name: 'typescript',
      message: 'Use TypeScript?',
      default: false,
    },
    {
      type: 'select',
      name: 'database',
      message: 'Database?',
      choices: [
        { name: 'None', value: 'none' },
        { name: 'MongoDB   — Mongoose ODM', value: 'mongodb' },
        { name: 'PostgreSQL — pg driver', value: 'postgresql' },
        { name: 'MySQL     — mysql2 driver', value: 'mysql' },
      ],
    },
    {
      type: 'confirm',
      name: 'docker',
      message: 'Include Docker config?',
      default: false,
    },
  ];
};
