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
      default: 'my-vue-app',
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
      message: pluginMeta.packageManagerQuestion.message,
      choices: availableManagers.map(m => ({
        name: m.name,
        value: m.value,
      })),
      default: availableManagers[0].value,
    },
    {
      type: 'confirm',
      name: 'router',
      message: 'Add Vue Router?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'pinia',
      message: 'Add Pinia (state management)?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'vitest',
      message: 'Add Vitest (unit testing)?',
      default: false,
    },
    {
      type: 'confirm',
      name: 'typescript',
      message: 'Add TypeScript?',
      default: false,
    },
    {
      type: 'confirm',
      name: 'eslint',
      message: 'Add ESLint?',
      default: true,
    },
  ];
};
