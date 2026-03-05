#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import figlet from 'figlet';
import ora from 'ora';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { version } = require('./package.json');

const program = new Command();

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

// ─── Program Setup ────────────────────────────────────
program
  .name('scaffy')
  .description('One command. Any framework. Ready to code.')
  .version(version, '-v, --version', 'Show current version');

// ─── Default Command (Interactive Mode) ───────────────
program
  .argument('[framework]', 'Framework to scaffold directly')
  .action(async framework => {
    showBanner();

    if (framework) {
      console.log(chalk.cyan(`\n🔍 Looking for framework: ${framework}...\n`));
      // TODO: Issue #008 — registry lookup comes here
      console.log(chalk.yellow(`⚠️  Registry not built yet. Coming soon!`));
      return;
    }

    // TODO: Issue #009 — interactive mode comes here
    console.log(chalk.yellow(`⚠️  Interactive mode coming soon!`));
  });

// ─── List Command ─────────────────────────────────────
program
  .command('list')
  .description('List all available frameworks')
  .action(() => {
    showBanner();
    // TODO: Issue #008 — registry list comes here
    console.log(chalk.yellow(`⚠️  Registry not built yet. Coming soon!`));
  });

// ─── Search Command ───────────────────────────────────
program
  .command('search <query>')
  .description('Search for a framework')
  .action(query => {
    showBanner();
    console.log(chalk.cyan(`\n🔍 Searching for: ${query}...\n`));
    // TODO: Issue #008 — registry search comes here
    console.log(chalk.yellow(`⚠️  Registry not built yet. Coming soon!`));
  });

// ─── Parse ────────────────────────────────────────────
program.parse(process.argv);
