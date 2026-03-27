export default async (answers, utils) => {
  const { projectName, projectType, database, docker } = answers;

  utils.title('Creating Symfony v7 Project');

  // ─── Step 1: Install ───────────────────────────────────
  utils.step(1, 'Running Symfony installer');

  if (projectType === 'webapp') {
    await utils.run(
      `composer create-project symfony/website-skeleton:"7.*" ${projectName}`
    );
  } else {
    await utils.run(
      `composer create-project symfony/skeleton:"7.*" ${projectName}`
    );
  }

  // ─── Step 2: API Platform ──────────────────────────────
  if (projectType === 'api') {
    utils.step(2, 'Installing API Platform');
    await utils.runInProject(projectName, 'composer require api-platform/core');
  }

  // ─── Step 3: Database ──────────────────────────────────
  if (database !== 'none') {
    utils.step(3, 'Configuring database');
    await utils.runInProject(projectName, 'composer require symfony/orm-pack');
    await utils.runInProject(
      projectName,
      'composer require --dev symfony/maker-bundle'
    );

    const dsnMap = {
      mysql: `mysql://root:password@127.0.0.1:3306/${projectName}?serverVersion=8.0`,
      postgresql: `postgresql://root:password@127.0.0.1:5432/${projectName}?serverVersion=15`,
      sqlite: `sqlite:///%kernel.project_dir%/var/data.db`,
    };

    await utils.setEnv(projectName, {
      DATABASE_URL: dsnMap[database],
    });
  }

  // ─── Step 4: Docker ────────────────────────────────────
  if (docker) {
    utils.step(4, 'Creating Docker config');

    const dockerCompose = `version: '3.8'
services:
  php:
    image: php:8.2-fpm
    volumes:
      - .:/var/www/html
    ports:
      - "9000:9000"
${
  database === 'mysql'
    ? `  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: ${projectName}
    ports:
      - "3306:3306"`
    : ''
}
${
  database === 'postgresql'
    ? `  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: password
      POSTGRES_DB: ${projectName}
    ports:
      - "5432:5432"`
    : ''
}
`;
    await utils.createFile(`${projectName}/docker-compose.yml`, dockerCompose);
  }

  utils.success(`Symfony v7 project "${projectName}" created successfully!`);
  utils.log(`  cd ${projectName}`);
  utils.log(`  symfony server:start`);
};
