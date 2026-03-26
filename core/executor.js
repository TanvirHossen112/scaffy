import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

const run = command =>
  new Promise((resolve, reject) => {
    console.log(chalk.gray(`\n  $ ${command}\n`));
    const [cmd, ...args] = command.split(' ');
    const child = spawn(cmd, args, {
      stdio: 'inherit',
      shell: true,
    });
    child.on('close', code => {
      if (code !== 0) {
        reject(new Error(`Command failed with exit code ${code}: ${command}`));
      } else {
        resolve();
      }
    });
    child.on('error', err => {
      reject(new Error(`Failed to run command: ${command}\n${err.message}`));
    });
  });

const runInProject = (projectName, command) => {
  console.log(chalk.gray(`\n  $ cd ${projectName} && ${command}\n`));
  return new Promise((resolve, reject) => {
    const [cmd, ...args] = command.split(' ');
    const child = spawn(cmd, args, {
      stdio: 'inherit',
      shell: true,
      cwd: path.join(process.cwd(), projectName),
    });
    child.on('close', code => {
      if (code !== 0) {
        reject(new Error(`Command failed with exit code ${code}: ${command}`));
      } else {
        resolve();
      }
    });
    child.on('error', err => {
      reject(new Error(`Failed to run command: ${command}\n${err.message}`));
    });
  });
};

const setEnv = (projectName, vars) => {
  const envPath = path.join(process.cwd(), projectName, '.env');
  if (!fs.existsSync(envPath)) {
    throw new Error(`.env file not found in ${projectName}`);
  }
  let content = fs.readFileSync(envPath, 'utf8');
  Object.entries(vars).forEach(([key, value]) => {
    const regex = new RegExp(`^${key}=.*`, 'm');
    if (regex.test(content)) {
      content = content.replace(regex, `${key}=${value}`);
    } else {
      content += `\n${key}=${value}`;
    }
  });
  fs.writeFileSync(envPath, content);
};

const appendToFile = (filePath, content) => {
  const fullPath = path.join(process.cwd(), filePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.appendFileSync(fullPath, content);
};

const createFile = (filePath, content = '') => {
  const fullPath = path.join(process.cwd(), filePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(fullPath, content);
};

export { run, runInProject, setEnv, appendToFile, createFile };
