export default async (answers, utils) => {
  const { projectName, packageManager, typescript, database, docker } = answers;

  utils.title('Creating ExpressJS v4 Project');

  // ─── Step 1: Create project folder ────────────────────
  utils.step(1, 'Creating project structure');
  await utils.run(`mkdir ${projectName}`);

  // ─── Step 2: Init package.json ────────────────────────
  utils.step(2, 'Initializing package.json');
  await utils.runInProject(projectName, `${packageManager} init -y`);

  // ─── Step 3: Install Express ──────────────────────────
  utils.step(3, 'Installing Express');
  await utils.runInProject(
    projectName,
    `${packageManager} ${packageManager === 'yarn' ? 'add' : 'install'} express`
  );

  // ─── Step 4: TypeScript ───────────────────────────────
  if (typescript) {
    utils.step(4, 'Installing TypeScript');
    const installCmd =
      packageManager === 'yarn'
        ? 'add -D'
        : packageManager === 'pnpm'
          ? 'add -D'
          : 'install -D';
    await utils.runInProject(
      projectName,
      `${packageManager} ${installCmd} typescript @types/express @types/node ts-node`
    );

    const tsConfig = `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
`;
    await utils.createFile(`${projectName}/tsconfig.json`, tsConfig);
  }

  // ─── Step 5: Database ─────────────────────────────────
  if (database !== 'none') {
    utils.step(5, 'Installing database dependencies');

    const installCmd = packageManager === 'yarn' ? 'add' : 'install';

    if (database === 'mongodb') {
      await utils.runInProject(
        projectName,
        `${packageManager} ${installCmd} mongoose`
      );
      if (typescript) {
        await utils.runInProject(
          projectName,
          `${packageManager} ${installCmd === 'add' ? 'add -D' : 'install -D'} @types/mongoose`
        );
      }
    }

    if (database === 'postgresql') {
      await utils.runInProject(
        projectName,
        `${packageManager} ${installCmd} pg`
      );
      if (typescript) {
        await utils.runInProject(
          projectName,
          `${packageManager} ${installCmd === 'add' ? 'add -D' : 'install -D'} @types/pg`
        );
      }
    }

    if (database === 'mysql') {
      await utils.runInProject(
        projectName,
        `${packageManager} ${installCmd} mysql2`
      );
    }
  }

  // ─── Step 6: Generate entry point ─────────────────────
  utils.step(6, 'Generating application files');

  const srcDir = typescript ? `${projectName}/src` : projectName;
  const entryFile = typescript ? 'index.ts' : 'index.js';

  if (typescript) {
    await utils.run(`mkdir ${projectName}/src`);
  }

  const indexContent = typescript
    ? `import express, { Request, Response } from 'express'

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello from ${projectName}' })
})

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`)
})

export default app
`
    : `import express from 'express'

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.json({ message: 'Hello from ${projectName}' })
})

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`)
})

export default app
`;

  await utils.createFile(`${srcDir}/${entryFile}`, indexContent);

  // ─── Step 7: .env ─────────────────────────────────────
  const envContent = `PORT=3000
NODE_ENV=development
${database === 'mongodb' ? `MONGODB_URI=mongodb://localhost:27017/${projectName}` : ''}
${database === 'postgresql' ? `DATABASE_URL=postgresql://user:password@localhost:5432/${projectName}` : ''}
${database === 'mysql' ? `DATABASE_URL=mysql://user:password@localhost:3306/${projectName}` : ''}
`;
  await utils.createFile(`${projectName}/.env`, envContent);
  await utils.createFile(`${projectName}/.env.example`, envContent);

  // ─── Step 8: .gitignore ───────────────────────────────
  const gitignore = `node_modules/
dist/
.env
*.log
`;
  await utils.createFile(`${projectName}/.gitignore`, gitignore);

  // ─── Step 9: Docker ───────────────────────────────────
  if (docker) {
    utils.step(7, 'Creating Docker config');

    const dockerfile = `FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN ${packageManager} install

COPY . .
${typescript ? 'RUN npm run build\n' : ''}
EXPOSE 3000
CMD [${typescript ? '"node", "dist/index.js"' : '"node", "index.js"'}]
`;

    const dockerCompose = `version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env
${
  database === 'mongodb'
    ? `  mongo:
    image: mongo:7
    ports:
      - "27017:27017"`
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

  utils.success(`ExpressJS v4 project "${projectName}" created successfully!`);
  utils.log(`  cd ${projectName}`);
  utils.log(`  ${typescript ? 'npx ts-node src/index.ts' : 'node index.js'}`);
  utils.log(`  Server running at http://localhost:3000`);
};
