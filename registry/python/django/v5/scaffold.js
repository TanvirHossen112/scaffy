export default async (answers, utils) => {
  const { projectName, database, restFramework, docker } = answers;

  utils.title('Creating Django v5 Project');

  // ─── Step 1: Install Django ────────────────────────────
  utils.step(1, 'Installing Django');
  await utils.run('pip3 install "django>=5.0,<6.0"');

  // ─── Step 2: Create Project ────────────────────────────
  utils.step(2, 'Creating Django project');
  await utils.run(`django-admin startproject ${projectName}`);

  // ─── Step 3: Database ──────────────────────────────────
  if (database === 'postgresql') {
    utils.step(3, 'Installing PostgreSQL driver');
    await utils.runInProject(projectName, 'pip3 install psycopg2-binary');
  }

  if (database === 'mysql') {
    utils.step(3, 'Installing MySQL driver');
    await utils.runInProject(projectName, 'pip3 install mysqlclient');
  }

  // ─── Step 4: REST Framework ────────────────────────────
  if (restFramework) {
    utils.step(4, 'Installing Django REST Framework');
    await utils.runInProject(projectName, 'pip3 install djangorestframework');

    const settingsPath = `${projectName}/${projectName}/settings.py`;
    await utils.appendToFile(
      settingsPath,
      `\n# Django REST Framework\nINSTALLED_APPS += ['rest_framework']\n`
    );
  }

  // ─── Step 5: requirements.txt ──────────────────────────
  utils.step(5, 'Generating requirements.txt');

  const requirements = [`django>=5.0,<6.0`];
  if (database === 'postgresql') requirements.push('psycopg2-binary');
  if (database === 'mysql') requirements.push('mysqlclient');
  if (restFramework) requirements.push('djangorestframework');

  await utils.createFile(
    `${projectName}/requirements.txt`,
    requirements.join('\n') + '\n'
  );

  // ─── Step 6: Docker ────────────────────────────────────
  if (docker) {
    utils.step(6, 'Creating Docker config');

    const dockerfile = `FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
`;

    const dockerCompose = `version: '3.8'
services:
  web:
    build: .
    ports:
      - "8000:8000"
    volumes:
      - .:/app
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
`;

    await utils.createFile(`${projectName}/Dockerfile`, dockerfile);
    await utils.createFile(`${projectName}/docker-compose.yml`, dockerCompose);
  }

  utils.success(`Django v5 project "${projectName}" created successfully!`);
  utils.log(`  cd ${projectName}`);
  utils.log(`  python manage.py migrate`);
  utils.log(`  python manage.py runserver`);
};
