import { execSync } from 'child_process';
import os from 'os';
import semver from 'semver';
import chalk from 'chalk';

const getOS = () => {
  const platform = os.platform();
  if (platform === 'darwin') return 'mac';
  if (platform === 'win32') return 'windows';
  return 'linux';
};

const runCommand = command => {
  try {
    return {
      success: true,
      output: execSync(command, {
        stdio: 'pipe',
        timeout: 5000,
      }).toString(),
    };
  } catch (error) {
    return {
      success: false,
      output: '',
    };
  }
};

const parseVersionFromOutput = (output, parseVersion) => {
  if (!parseVersion || !output) return null;
  const match = output.match(new RegExp(parseVersion));
  return match ? match[1] : null;
};

const satisfiesMinVersion = (installedVersion, minVersion) => {
  if (!installedVersion || !minVersion) return true;
  const clean = semver.coerce(installedVersion);
  if (!clean) return true;
  return semver.gte(clean, minVersion);
};

const buildToolResult = (tool, installed, versionOk, extra = {}) => ({
  tool,
  installed,
  versionOk,
  ...extra,
});

const checkTool = requirement => {
  const { tool, checkCommand, parseVersion, minVersion } = requirement;
  const { success, output } = runCommand(checkCommand);
  if (!success) {
    return buildToolResult(tool, false, false);
  }
  if (!parseVersion || !minVersion) {
    return buildToolResult(tool, true, true);
  }
  const installedVersion = parseVersionFromOutput(output, parseVersion);
  if (!installedVersion) {
    return buildToolResult(tool, true, true);
  }
  const versionOk = satisfiesMinVersion(installedVersion, minVersion);
  return buildToolResult(tool, true, versionOk, {
    installedVersion,
    ...(!versionOk && { requiredVersion: minVersion }),
  });
};

const checkAll = requirements => {
  const results = requirements.map(req => ({
    ...checkTool(req),
    installGuide: req.installGuide,
  }));
  const allPassed = results.every(r => r.installed && r.versionOk);
  return { allPassed, results };
};

const formatToolStatus = result => {
  if (result.installed && result.versionOk) {
    return chalk.green(`  ✅ ${result.tool}`) + chalk.gray(' — found');
  }
  if (result.installed && !result.versionOk) {
    return (
      chalk.yellow(`  ⚠️  ${result.tool}`) +
      chalk.gray(
        ` — v${result.installedVersion} found,` +
          ` v${result.requiredVersion}+ required`
      )
    );
  }
  return chalk.red(`  ❌ ${result.tool}`) + chalk.gray(' — not found');
};

const formatInstallGuide = (guide, currentOS) => {
  if (!guide) return [];
  const lines = [];
  if (guide[currentOS]) {
    lines.push(chalk.cyan(`     💻 Install: `) + chalk.white(guide[currentOS]));
  }
  if (guide.docs) {
    lines.push(chalk.cyan(`     📖 Docs: `) + chalk.underline(guide.docs));
  }
  return lines;
};

const formatResult = currentOS => result => {
  const lines = [formatToolStatus(result)];
  const needsGuide = !result.installed || !result.versionOk;
  if (needsGuide) {
    lines.push(...formatInstallGuide(result.installGuide, currentOS));
  }
  return lines.join('\n');
};

const formatFailureMessage = () =>
  chalk.red(`
    ──────────────────────────────────────────
    ❌ Requirements not met.
       Please install missing tools and retry.
       Nothing was created. Your system is clean.
    ──────────────────────────────────────────\n`);

const formatSuccessMessage = () =>
  chalk.green('\n  ✅ All requirements met!\n');

const report = requirements => {
  console.log(chalk.bold('\n🔍 Checking requirements...\n'));
  const { allPassed, results } = checkAll(requirements);
  const currentOS = getOS();
  results.map(formatResult(currentOS)).forEach(line => console.log(line));
  console.log(allPassed ? formatSuccessMessage() : formatFailureMessage());
  return allPassed;
};

const detectAvailableChoices = async choices => {
  if (!choices || choices.length === 0) return [];
  const results = await Promise.all(
    choices.map(async choice => {
      try {
        const { success, output } = runCommand(choice.checkCommand);
        if (!success || !output || output.toString().trim() === '') {
          return { ...choice, installed: false };
        }
        return { ...choice, installed: true };
      } catch {
        return { ...choice, installed: false };
      }
    })
  );
  const available = results.filter(c => c.installed);
  return available.length > 0
    ? available
    : [{ ...choices[0], installed: false }];
};

export {
  getOS,
  runCommand,
  parseVersionFromOutput,
  satisfiesMinVersion,
  buildToolResult,
  checkTool,
  checkAll,
  formatToolStatus,
  formatInstallGuide,
  formatResult,
  formatFailureMessage,
  formatSuccessMessage,
  report,
  detectAvailableChoices,
};
