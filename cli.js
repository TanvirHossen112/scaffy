#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const figlet = require('figlet');
const ora = require('ora');
const { version } = require('./package.json');
const detector = require('./core/detector');
const registry = require('./core/registry');
const interviewer = require('./core/interviewer');
const executor = require('./core/executor');
const { buildPluginUtils, title, error, divider } = require('./core/utils');

// ─── Banner ───────────────────────────────────────────
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

// ─── Run Full Scaffold Flow ────────────────────────────
const runScaffold = async framework => {
  try {
    // Step 1 — Load plugin
    const version = await interviewer.askVersion(framework);
    const plugin = registry.loadPlugin(framework, version);

    // Step 2 — Check requirements
    const requirementsMet = await detector.report(plugin.meta.requires);

    if (!requirementsMet) {
      process.exit(1);
    }

    // Step 3 — Ask questions
    const answers = await interviewer.askFrameworkQuestions(framework, plugin);

    // Step 4 — Build utils for plugin
    const utils = buildPluginUtils(executor);

    // Step 5 — Run scaffold
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

// ─── Program Setup ────────────────────────────────────
const program = new Command();

program
  .name('scaffy')
  .description('One command. Any framework. Ready to code.')
  .version(version, '-v, --version', 'Show current version');

// ─── Default Command ───────────────────────────────────
program
  .argument('[framework]', 'Framework name to scaffold directly')
  .action(async frameworkQuery => {
    showBanner();

    // Direct framework mode
    if (frameworkQuery) {
      const framework = await interviewer.askDirectFramework(frameworkQuery);
      if (!framework) process.exit(1);
      await runScaffold(framework);
      return;
    }

    // Interactive mode
    try {
      title('Select A Framework');
      const framework = await interviewer.askFramework();
      await runScaffold(framework);
    } catch {
      console.log(chalk.yellow('\n  👋 Scaffolding cancelled\n'));
      process.exit(0);
    }
  });

// ─── List Command ──────────────────────────────────────
program
  .command('list')
  .description('List all available frameworks')
  .action(() => {
    showBanner();
    registry.displayFrameworks();
  });

// ─── Search Command ────────────────────────────────────
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

// ─── Parse ────────────────────────────────────────────
program.parse(process.argv);
