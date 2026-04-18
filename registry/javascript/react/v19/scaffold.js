export default async (answers, utils) => {
  const { projectName, variant, packageManager } = answers;

  utils.title('React');
  utils.divider();

  utils.step(1, `Scaffolding ${projectName}`);
  await utils.run(
    `npm create vite@latest ${projectName} -- --template ${variant}`
  );

  utils.step(2, 'Installing dependencies');
  if (packageManager === 'yarn') {
    await utils.runInProject(projectName, 'yarn');
  } else if (packageManager === 'pnpm') {
    await utils.runInProject(projectName, 'pnpm install');
  } else {
    await utils.runInProject(projectName, 'npm install');
  }

  utils.divider();
  utils.success(`${projectName} is ready!`);
  utils.log(`  cd ${projectName}`);

  if (packageManager === 'yarn') {
    utils.log('  yarn dev');
  } else if (packageManager === 'pnpm') {
    utils.log('  pnpm dev');
  } else {
    utils.log('  npm run dev');
  }

  utils.divider();
};
