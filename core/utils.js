const chalk = require('chalk');

const log = message => {
  console.log(chalk.white(`  ${message}`));
};

// ─── Success Message ───────────────────────────────────
const success = message => {
  console.log(chalk.green(`\n  ${message}\n`));
};

// ─── Warning Message ───────────────────────────────────
const warn = message => {
  console.log(chalk.yellow(`  ⚠️  ${message}`));
};

// ─── Error Message ─────────────────────────────────────
const error = message => {
  console.log(chalk.red(`  ❌ ${message}`));
};

// ─── Section Title ─────────────────────────────────────
const title = message => {
  console.log(chalk.cyan.bold(`\n  ── ${message} ──\n`));
};

// ─── Divider Line ──────────────────────────────────────
const divider = () => {
  console.log(chalk.gray('  ──────────────────────────────────────────'));
};

// ─── Step Indicator ────────────────────────────────────
const step = (number, message) => {
  console.log(chalk.cyan(`  [${number}]`) + chalk.white(` ${message}`));
};

// ─── Build Utils Object For Plugins ───────────────────
const buildPluginUtils = executor => ({
  run: executor.run,
  runInProject: executor.runInProject,
  setEnv: executor.setEnv,
  appendToFile: executor.appendToFile,
  createFile: executor.createFile,
  log,
  success,
  warn,
  error,
  step,
});

// ─── Exports ───────────────────────────────────────────
module.exports = {
  log,
  success,
  warn,
  error,
  title,
  divider,
  step,
  buildPluginUtils,
};
