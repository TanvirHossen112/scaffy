export default async (answers, utils) => {
  const { projectName, starterKit, database, docker } = answers;

  utils.title('Creating Laravel v12 Project');

  utils.step(1, 'Running Laravel installer');
  await utils.run(
    `composer create-project laravel/laravel:^12.0 ${projectName}`
  );

  if (starterKit === 'breeze') {
    utils.step(2, 'Installing Laravel Breeze');
    await utils.runInProject(
      projectName,
      'composer require laravel/breeze --dev'
    );
    await utils.runInProject(projectName, 'php artisan breeze:install');
  }

  if (starterKit === 'jetstream') {
    utils.step(2, 'Installing Laravel Jetstream');
    await utils.runInProject(projectName, 'composer require laravel/jetstream');
    await utils.runInProject(
      projectName,
      'php artisan jetstream:install livewire'
    );
  }

  utils.step(3, 'Configuring database');
  await utils.setEnv(projectName, {
    DB_CONNECTION: database,
    DB_DATABASE:
      database === 'sqlite' ? 'database/database.sqlite' : projectName,
  });

  if (docker) {
    utils.step(4, 'Installing Laravel Sail');
    await utils.runInProject(
      projectName,
      'composer require laravel/sail --dev'
    );
    await utils.runInProject(projectName, 'php artisan sail:install');
  }

  utils.success(`Laravel v12 project "${projectName}" created successfully!`);
};
