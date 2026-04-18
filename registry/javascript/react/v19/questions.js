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
      default: 'my-react-app',
      validate: val => val.trim() !== '' || 'Project name cannot be empty.',
    },
    {
      type: 'list',
      name: 'variant',
      message: 'Variant:',
      choices: [
        { name: 'TypeScript', value: 'react-ts' },
        { name: 'JavaScript', value: 'react' },
        { name: 'TypeScript + SWC', value: 'react-swc-ts' },
        { name: 'JavaScript + SWC', value: 'react-swc' },
      ],
    },
    {
      type: 'list',
      name: 'packageManager',
      message: pluginMeta.packageManagerQuestion.message,
      choices: availableManagers,
    },
  ];
};
