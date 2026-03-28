export default async (answers, utils) => {
  const { projectName, packageManager, database, auth, docker } = answers;

  // ─── Step 1 — Install NestJS CLI + Create Project ──
  utils.title('Creating NestJS v10 Project');
  utils.step(1, `Scaffolding ${projectName}...`);

  await utils.run(
    `npx @nestjs/cli@10 new ${projectName} --package-manager ${packageManager} --skip-git`
  );

  // ─── Step 2 — Database ────────────────────────────
  if (database !== 'none') {
    utils.step(2, `Installing ${database} database packages...`);

    if (database === 'mongodb') {
      await utils.runInProject(
        projectName,
        `${packageManager} ${packageManager === 'yarn' ? 'add' : 'install'} @nestjs/mongoose mongoose`
      );
    } else {
      // TypeORM based (postgres, mysql, sqlite)
      const dbDriver = {
        postgres: 'pg',
        mysql: 'mysql2',
        sqlite: 'sqlite3',
      };

      await utils.runInProject(
        projectName,
        `${packageManager} ${packageManager === 'yarn' ? 'add' : 'install'} @nestjs/typeorm typeorm ${dbDriver[database]}`
      );
    }
  }

  // ─── Step 3 — Auth ────────────────────────────────
  if (auth) {
    utils.step(3, 'Installing Passport JWT authentication...');
    await utils.runInProject(
      projectName,
      `${packageManager} ${packageManager === 'yarn' ? 'add' : 'install'} @nestjs/passport passport passport-jwt @nestjs/jwt`
    );
    await utils.runInProject(
      projectName,
      `${packageManager} ${packageManager === 'yarn' ? 'add' : 'install'} -D @types/passport-jwt`
    );
  }

  // ─── Step 4 — Docker ──────────────────────────────
  if (docker) {
    utils.step(4, 'Adding Dockerfile...');

    await utils.createFile(
      `${projectName}/Dockerfile`,
      `FROM node:20-alpine AS builder
  WORKDIR /app
  COPY package*.json ./
  RUN npm ci
  COPY . .
  RUN npm run build
  
  FROM node:20-alpine AS production
  WORKDIR /app
  COPY package*.json ./
  RUN npm ci --only=production
  COPY --from=builder /app/dist ./dist
  EXPOSE 3000
  CMD ["node", "dist/main"]
  `
    );

    await utils.createFile(
      `${projectName}/.dockerignore`,
      `node_modules
  dist
  .git
  .env
  `
    );
  }

  // ─── Done ─────────────────────────────────────────
  utils.success(`✅ NestJS v10 project ready!`);
  utils.log(`  cd ${projectName}`);

  if (docker) {
    utils.log(`  docker build -t ${projectName} .`);
    utils.log(`  docker run -p 3000:3000 ${projectName}`);
  } else {
    utils.log(`  ${packageManager} run start:dev`);
  }

  utils.log('');
};
