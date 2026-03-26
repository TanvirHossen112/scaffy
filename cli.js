#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import figlet from 'figlet';
import ora from 'ora';
import { createRequire } from 'module';
import * as detector from './core/detector.js';
import * as registry from './core/registry.js';
import * as interviewer from './core/interviewer.js';
import * as executor from './core/executor.js';
import { buildPluginUtils, title, error, divider } from './core/utils.js';

const require = createRequire(import.meta.url);
const { version } = require('./package.json');

const showBanner = () => {
  console.log(
    chalk.cyan(
      figlet.textSync('Scaffy', {
        font: 'Big',
        horizontalLayout: 'default',
      })
    )
  );
  console.log(chalk.gray('  One command. Any framework. Ready to code.\n'));
};

const runScaffold = async framework => {
  try {
    const selectedVersion = await interviewer.askVersion(framework);
    const plugin = await registry.loadPlugin(framework, selectedVersion);

    const requirementsMet = await detector.report(plugin.meta.requires);
    if (!requirementsMet) {
      process.exit(1);
    }

    const answers = await interviewer.askFrameworkQuestions(framework, plugin);

    const utils = buildPluginUtils(executor);

    divider();
    const spinner = ora(
      chalk.cyan(`Scaffolding ${framework.name} project...`)
    ).start();
    try {
      await plugin.scaffold(answers, utils);
      spinner.succeed(
        chalk.green(`${framework.name} project created successfully!`)
      );
    } catch (err) {
      spinner.fail(chalk.red('Scaffolding failed'));
      error(err.message);
      process.exit(1);
    }
  } catch (err) {
    if (err.message !== 'cancelled') {
      error(`Unexpected error: ${err.message}`);
    }
    process.exit(1);
  }
};

const program = new Command();

program
  .name('scaffy')
  .description('One command. Any framework. Ready to code.')
  .version(version, '-v, --version', 'Show current version');

program
  .argument('[framework]', 'Framework name to scaffold directly')
  .action(async frameworkQuery => {
    showBanner();
    if (frameworkQuery) {
      const framework = await interviewer.askDirectFramework(frameworkQuery);
      if (!framework) process.exit(1);
      await runScaffold(framework);
      return;
    }
    try {
      title('Select A Framework');
      const framework = await interviewer.askFramework();
      await runScaffold(framework);
    } catch {
      console.log(chalk.yellow('\n  👋 Scaffolding cancelled\n'));
      process.exit(0);
    }
  });

program
  .command('list')
  .description('List all available frameworks')
  .action(() => {
    showBanner();
    registry.displayFrameworks();
  });

program
  .command('search <query>')
  .description('Search for a framework by name or language')
  .action(query => {
    showBanner();
    const results = registry.searchFrameworks(query);
    if (results.length === 0) {
      console.log(chalk.red(`\n  No frameworks found for "${query}"\n`));
      console.log(
        chalk.gray('  Run scaffy list to see all available frameworks\n')
      );
      return;
    }
    console.log(chalk.bold(`\n  🔍 Results for "${query}":\n`));
    results.forEach(f => {
      console.log(
        chalk.white(`  • ${f.name}`) +
          chalk.gray(` (${f.language}) — scaffy ${f.alias[0]}`)
      );
    });
    console.log('');
  });

program.parse(process.argv);
