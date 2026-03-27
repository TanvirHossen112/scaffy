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
      type: 'list',
      name: 'packageManager',
      message: pluginMeta.packageManagerQuestion.message,
      choices: availableManagers,
    },
    {
      type: 'confirm',
      name: 'typescript',
      message: 'Use TypeScript?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'tailwind',
      message: 'Use Tailwind CSS?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'appRouter',
      message: 'Use App Router? (recommended)',
      default: true,
    },
    {
      type: 'confirm',
      name: 'srcDir',
      message: 'Use src/ directory?',
      default: false,
    },
  ];
};
