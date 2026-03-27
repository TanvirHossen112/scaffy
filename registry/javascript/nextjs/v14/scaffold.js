export default async (answers, utils) => {
  const {
    projectName,
    packageManager,
    typescript,
    tailwind,
    appRouter,
    srcDir,
  } = answers;

  utils.title('Creating NextJS v14 Project');

  // ─── Step 1: Build flags ───────────────────────────────
  utils.step(1, 'Configuring create-next-app flags');

  const flags = [
    typescript ? '--typescript' : '--no-typescript',
    tailwind ? '--tailwind' : '--no-tailwind',
    appRouter ? '--app' : '--no-app',
    srcDir ? '--src-dir' : '--no-src-dir',
    `--use-${packageManager}`,
    '--no-eslint',
    '--skip-install',
  ].join(' ');

  // ─── Step 2: Run create-next-app ──────────────────────
  utils.step(2, 'Running create-next-app@14');
  await utils.run(`npx create-next-app@14 ${projectName} ${flags}`);

  // ─── Step 3: Install dependencies ─────────────────────
  utils.step(3, 'Installing dependencies');
  const installCmd = packageManager === 'yarn' ? 'install' : 'install';
  await utils.runInProject(projectName, `${packageManager} ${installCmd}`);

  // ─── Step 4: .env.local ───────────────────────────────
  utils.step(4, 'Generating environment files');

  const envLocal = `# Environment Variables
# Add your environment variables here
NEXT_PUBLIC_APP_URL=http://localhost:3000
`;
  await utils.createFile(`${projectName}/.env.local`, envLocal);
  await utils.createFile(`${projectName}/.env.example`, envLocal);

  // ─── Step 5: .gitignore addition ──────────────────────
  await utils.appendToFile(
    `${projectName}/.gitignore`,
    '\n# Environment\n.env.local\n.env*.local\n'
  );

  utils.success(`NextJS v14 project "${projectName}" created successfully!`);
  utils.log(`  cd ${projectName}`);
  utils.log(
    `  ${packageManager} ${packageManager === 'yarn' ? 'dev' : 'run dev'}`
  );
  utils.log(`  App running at http://localhost:3000`);
};
