module.exports = async (answers, utils) => {
  const { projectName, starterKit, database, docker } = answers;

  // ─── Step 1 — Create Laravel Project ──────────────
  utils.title('Creating Laravel v11 Project');
  utils.step(1, `Scaffolding ${projectName}...`);

  await utils.run(
    `composer create-project laravel/laravel:^11.0 ${projectName}`
  );

  // ─── Step 2 — Configure Database ──────────────────
  utils.step(2, `Configuring ${database} database...`);

  await utils.setEnv(projectName, {
    DB_CONNECTION: database,
    APP_NAME: projectName,
  });

  // ─── Step 3 — Generate App Key ─────────────────────
  utils.step(3, 'Generating application key...');
  await utils.runInProject(projectName, 'php artisan key:generate');

  // ─── Step 4 — Starter Kit ─────────────────────────
  if (starterKit === 'breeze') {
    utils.step(4, 'Installing Laravel Breeze...');
    await utils.runInProject(
      projectName,
      'composer require laravel/breeze --dev'
    );
    await utils.runInProject(
      projectName,
      'php artisan breeze:install blade --quiet'
    );
    await utils.runInProject(projectName, 'npm install');
    await utils.runInProject(projectName, 'npm run build');
  }

  if (starterKit === 'jetstream') {
    utils.step(4, 'Installing Laravel Jetstream...');
    await utils.runInProject(projectName, 'composer require laravel/jetstream');
    await utils.runInProject(
      projectName,
      'php artisan jetstream:install livewire'
    );
    await utils.runInProject(projectName, 'npm install');
    await utils.runInProject(projectName, 'npm run build');
  }

  // ─── Step 5 — Docker / Sail ───────────────────────
  if (docker) {
    utils.step(5, 'Installing Laravel Sail...');
    await utils.runInProject(
      projectName,
      'composer require laravel/sail --dev'
    );
    await utils.runInProject(
      projectName,
      'php artisan sail:install --with=mysql,redis'
    );
  }

  // ─── Done ─────────────────────────────────────────
  utils.success(`✅ Laravel v11 project ready!`);
  utils.log(`  cd ${projectName}`);

  if (docker) {
    utils.log(`  ./vendor/bin/sail up`);
  } else {
    utils.log(`  php artisan serve`);
  }

  utils.log('');
};
