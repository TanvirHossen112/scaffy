import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

const REGISTRY_PATH = path.join(__dirname, '..', 'registry');
const INDEX_PATH = path.join(REGISTRY_PATH, 'index.json');

const loadIndex = () => {
  try {
    const raw = fs.readFileSync(INDEX_PATH, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const getFrameworks = () => {
  const index = loadIndex();
  if (!index) {
    console.log(chalk.red('❌ Failed to load registry/index.json'));
    return [];
  }
  return index.frameworks;
};

const isPluginComplete = framework => {
  const pluginPath = path.join(REGISTRY_PATH, framework.path);
  const versionPath = path.join(pluginPath, framework.latest);
  return (
    fs.existsSync(path.join(versionPath, 'questions.js')) &&
    fs.existsSync(path.join(versionPath, 'scaffold.js'))
  );
};

const getAvailableFrameworks = () => getFrameworks().filter(isPluginComplete);

const findFramework = query => {
  const q = query.toLowerCase().trim();
  return (
    getAvailableFrameworks().find(
      f =>
        f.name.toLowerCase() === q || f.alias.some(a => a.toLowerCase() === q)
    ) || null
  );
};

const searchFrameworks = query => {
  const q = query.toLowerCase().trim();
  return getAvailableFrameworks().filter(
    f =>
      f.name.toLowerCase().includes(q) ||
      f.language.toLowerCase().includes(q) ||
      f.alias.some(a => a.toLowerCase().includes(q))
  );
};

const groupByLanguage = frameworks =>
  frameworks.reduce(
    (acc, f) => ({
      ...acc,
      [f.language]: [...(acc[f.language] || []), f],
    }),
    {}
  );

const validatePluginFiles = (pluginPath, version) => {
  const versionPath = path.join(pluginPath, version);
  const requiredFiles = [
    { path: path.join(pluginPath, 'plugin.json'), name: 'plugin.json' },
    { path: path.join(versionPath, 'questions.js'), name: 'questions.js' },
    { path: path.join(versionPath, 'scaffold.js'), name: 'scaffold.js' },
  ];
  const missing = requiredFiles
    .filter(f => !fs.existsSync(f.path))
    .map(f => f.name);
  return {
    valid: missing.length === 0,
    missing,
  };
};

const loadPlugin = async (framework, version) => {
  const pluginPath = path.join(REGISTRY_PATH, framework.path);
  const versionPath = path.join(pluginPath, version);
  const { valid, missing } = validatePluginFiles(pluginPath, version);
  if (!valid) {
    throw new Error(
      `Missing files for ${framework.name} ${version}: ` + missing.join(', ')
    );
  }
  const meta = JSON.parse(
    fs.readFileSync(path.join(pluginPath, 'plugin.json'), 'utf8')
  );
  const { default: questions } = await import(
    path.join(versionPath, 'questions.js')
  );
  const { default: scaffold } = await import(
    path.join(versionPath, 'scaffold.js')
  );
  return { meta, questions, scaffold };
};

const formatFrameworkLine = f =>
  chalk.white(`    • ${f.name}`) +
  chalk.gray(` (${f.alias.join(', ')}) — latest: ${f.latest}`);

const displayFrameworks = () => {
  const frameworks = getAvailableFrameworks();
  if (frameworks.length === 0) {
    console.log(chalk.red('\n❌ No frameworks found\n'));
    return;
  }
  const grouped = groupByLanguage(frameworks);
  console.log(chalk.bold('\n📦 Available Frameworks:\n'));
  Object.entries(grouped).forEach(([lang, list]) => {
    console.log(chalk.cyan(`  ${lang.toUpperCase()}`));
    list.forEach(f => console.log(formatFrameworkLine(f)));
    console.log('');
  });
};

export {
  loadIndex,
  getFrameworks,
  getAvailableFrameworks,
  isPluginComplete,
  findFramework,
  searchFrameworks,
  groupByLanguage,
  validatePluginFiles,
  loadPlugin,
  formatFrameworkLine,
  displayFrameworks,
};
