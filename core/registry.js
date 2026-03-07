const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

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

const findFramework = query => {
  const q = query.toLowerCase().trim();

  return (
    getFrameworks().find(
      f =>
        f.name.toLowerCase() === q || f.alias.some(a => a.toLowerCase() === q)
    ) || null
  );
};

const searchFrameworks = query => {
  const q = query.toLowerCase().trim();

  return getFrameworks().filter(
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

const loadPlugin = (framework, version) => {
  const pluginPath = path.join(REGISTRY_PATH, framework.path);
  const versionPath = path.join(pluginPath, version);

  const { valid, missing } = validatePluginFiles(pluginPath, version);

  if (!valid) {
    throw new Error(
      `Missing files for ${framework.name} ${version}: ` + missing.join(', ')
    );
  }

  return {
    meta: require(path.join(pluginPath, 'plugin.json')),
    questions: require(path.join(versionPath, 'questions.js')),
    scaffold: require(path.join(versionPath, 'scaffold.js')),
  };
};

const formatFrameworkLine = f =>
  chalk.white(`    • ${f.name}`) +
  chalk.gray(` (${f.alias.join(', ')}) — latest: ${f.latest}`);

const displayFrameworks = () => {
  const frameworks = getFrameworks();

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

module.exports = {
  loadIndex,
  getFrameworks,
  findFramework,
  searchFrameworks,
  groupByLanguage,
  validatePluginFiles,
  loadPlugin,
  formatFrameworkLine,
  displayFrameworks,
};
