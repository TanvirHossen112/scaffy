import chalk from 'chalk';
import inquirer from 'inquirer';
import { getFrameworks, findFramework } from './registry.js';

const baseQuestions = framework => [
  {
    type: 'input',
    name: 'projectName',
    message: 'Project name?',
    default: `my-${framework.name.toLowerCase()}-app`,
    validate: input => {
      if (!input.trim()) {
        return 'Project name is required';
      }
      if (!/^[a-z0-9-_]+$/.test(input)) {
        return 'Use only lowercase letters, numbers, - and _';
      }
      return true;
    },
  },
];

const buildQuestions = (framework, pluginQuestions) => [
  ...baseQuestions(framework),
  ...pluginQuestions,
];

const buildFrameworkChoices = () =>
  getFrameworks().map(f => ({
    name:
      `${f.name} ${chalk.gray(`(${f.language})`)} ` +
      chalk.cyan(`— latest: ${f.latest}`),
    value: f,
  }));

const buildVersionChoices = framework =>
  framework.versions.map(v => ({
    name: v === framework.latest ? `${v} ${chalk.cyan('(latest ⭐)')}` : v,
    value: v,
  }));

const askFramework = async () => {
  const { framework } = await inquirer.prompt([
    {
      type: 'list',
      name: 'framework',
      message: 'Which framework?',
      choices: buildFrameworkChoices(),
    },
  ]);
  return framework;
};

const askVersion = async framework => {
  if (framework.versions.length === 1) {
    return framework.latest;
  }
  const { version } = await inquirer.prompt([
    {
      type: 'list',
      name: 'version',
      message: 'Which version?',
      choices: buildVersionChoices(framework),
    },
  ]);
  return version;
};

const askDirectFramework = async query => {
  const framework = findFramework(query);
  if (!framework) {
    console.log(chalk.red(`\n❌ Framework "${query}" not found.\n`));
    console.log(
      chalk.gray('  Run scaffy list to see all available frameworks.\n')
    );
    return null;
  }
  return framework;
};

const askFrameworkQuestions = async (framework, plugin) => {
  console.log(chalk.bold(`\n🚀 Setting up ${framework.name}\n`));
  const pluginQuestions =
    typeof plugin.questions === 'function'
      ? await plugin.questions()
      : plugin.questions;
  const questions = buildQuestions(framework, pluginQuestions);
  const answers = await inquirer.prompt(questions);
  return answers;
};

const handlePromptError = err => {
  if (err.isTtyError) {
    console.log(chalk.red('\n❌ Terminal not supported\n'));
  } else {
    console.log(chalk.yellow('\n👋 Scaffolding cancelled\n'));
  }
  process.exit(0);
};

const runInterview = async (framework, plugin) => {
  try {
    const version = await askVersion(framework);
    const answers = await askFrameworkQuestions(framework, plugin);
    return { version, answers };
  } catch (err) {
    handlePromptError(err);
  }
};

const runInteractiveMode = async () => {
  try {
    const framework = await askFramework();
    const version = await askVersion(framework);
    return { framework, version };
  } catch (err) {
    handlePromptError(err);
  }
};

export {
  baseQuestions,
  buildQuestions,
  buildFrameworkChoices,
  buildVersionChoices,
  askFramework,
  askVersion,
  askDirectFramework,
  askFrameworkQuestions,
  handlePromptError,
  runInterview,
  runInteractiveMode,
};
