export default async (answers, utils) => {
  const { projectName, packageManager, router, pinia, typescript, eslint } =
    answers;

  // ─── Step 1 — Build create-vue flags ──────────────
  utils.title('Creating VueJS v3 Project');
  utils.step(1, `Scaffolding ${projectName}...`);

  const flags = [
    router ? '--router' : '--no-router',
    pinia ? '--pinia' : '--no-pinia',
    typescript ? '--typescript' : '--no-typescript',
    eslint ? '--eslint' : '--no-eslint',
  ].join(' ');

  await utils.run(`npx create-vue@3 ${projectName} ${flags}`);

  // ─── Step 2 — Install Dependencies ────────────────
  utils.step(2, 'Installing dependencies...');

  const installCmd =
    packageManager === 'yarn'
      ? 'yarn'
      : packageManager === 'pnpm'
        ? 'pnpm install'
        : 'npm install';

  await utils.runInProject(projectName, installCmd);

  // ─── Step 3 — TypeScript extras ───────────────────
  if (typescript) {
    utils.step(3, 'Configuring TypeScript...');
    await utils.runInProject(
      projectName,
      `${packageManager === 'yarn' ? 'yarn add' : packageManager + ' install'} -D vue-tsc`
    );
  }

  // ─── Done ─────────────────────────────────────────
  utils.success(`✅ VueJS v3 project ready!`);
  utils.log(`  cd ${projectName}`);
  utils.log(
    `  ${packageManager === 'yarn' ? 'yarn' : packageManager + ' run'} dev`
  );
  utils.log('');
};
