import chalk from 'chalk';

const log = message => {
  console.log(chalk.white(`  ${message}`));
};

const success = message => {
  console.log(chalk.green(`\n  ${message}\n`));
};

const warn = message => {
  console.log(chalk.yellow(`  ⚠️  ${message}`));
};

const error = message => {
  console.log(chalk.red(`  ❌ ${message}`));
};

const title = message => {
  console.log(chalk.cyan.bold(`\n  ── ${message} ──\n`));
};

const divider = () => {
  console.log(chalk.gray('  ──────────────────────────────────────────'));
};

const step = (number, message) => {
  console.log(chalk.cyan(`  [${number}]`) + chalk.white(` ${message}`));
};

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
  title,
  step,
  divider,
});

export { log, success, warn, error, title, divider, step, buildPluginUtils };
