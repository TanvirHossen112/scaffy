export default async (answers, utils) => {
  const { projectName, database, async: useAsync, docker } = answers;

  utils.title('Creating FastAPI Project');

  // ─── Step 1: Create project folder ────────────────────
  utils.step(1, 'Creating project structure');
  await utils.run(`mkdir ${projectName}`);
  await utils.run(`mkdir ${projectName}/app`);

  // ─── Step 2: Create virtual environment ───────────────
  utils.step(2, 'Creating virtual environment');
  await utils.runInProject(projectName, 'python3 -m venv venv');

  // ─── Step 3: Install FastAPI + Uvicorn ────────────────
  utils.step(3, 'Installing FastAPI and Uvicorn');
  await utils.runInProject(
    projectName,
    'venv/bin/pip install "fastapi>=0.100.0" "uvicorn[standard]"'
  );

  // ─── Step 4: Database drivers ─────────────────────────
  if (database !== 'none') {
    utils.step(4, 'Installing database dependencies');
    await utils.runInProject(
      projectName,
      'venv/bin/pip install sqlalchemy alembic'
    );

    if (database === 'postgresql') {
      const driver = useAsync ? 'asyncpg' : 'psycopg2-binary';
      await utils.runInProject(projectName, `venv/bin/pip install ${driver}`);
    }

    if (database === 'mysql') {
      const driver = useAsync ? 'aiomysql' : 'mysqlclient';
      await utils.runInProject(projectName, `venv/bin/pip install ${driver}`);
    }

    if (database === 'sqlite' && useAsync) {
      await utils.runInProject(projectName, 'venv/bin/pip install aiosqlite');
    }
  }

  // ─── Step 5: Generate main.py ─────────────────────────
  utils.step(5, 'Generating application files');

  const mainPy = `from fastapi import FastAPI

app = FastAPI(title="${projectName}", version="0.1.0")


@app.get("/")
${useAsync ? 'async ' : ''}def root():
    return {"message": "Hello from ${projectName}"}


@app.get("/health")
${useAsync ? 'async ' : ''}def health():
    return {"status": "ok"}
`;

  await utils.createFile(`${projectName}/app/main.py`, mainPy);

  // ─── Step 6: Generate database.py if needed ───────────
  if (database !== 'none') {
    const dsnMap = {
      postgresql: useAsync
        ? `postgresql+asyncpg://user:password@localhost/${projectName}`
        : `postgresql+psycopg2://user:password@localhost/${projectName}`,
      mysql: useAsync
        ? `mysql+aiomysql://user:password@localhost/${projectName}`
        : `mysql+mysqlclient://user:password@localhost/${projectName}`,
      sqlite: useAsync
        ? `sqlite+aiosqlite:///./data.db`
        : `sqlite:///./data.db`,
    };

    const databasePy = `from sqlalchemy${useAsync ? '.ext.asyncio' : ''} import create_engine${useAsync ? ', AsyncSession' : ''}, sessionmaker
from sqlalchemy.orm import DeclarativeBase

DATABASE_URL = "${dsnMap[database]}"

${
  useAsync
    ? `engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)`
    : `engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)`
}


class Base(DeclarativeBase):
    pass
`;
    await utils.createFile(`${projectName}/app/database.py`, databasePy);
  }

  // ─── Step 7: Generate __init__.py ─────────────────────
  await utils.createFile(`${projectName}/app/__init__.py`, '');

  // ─── Step 8: requirements.txt ─────────────────────────
  utils.step(6, 'Generating requirements.txt');

  const requirements = ['fastapi>=0.100.0', 'uvicorn[standard]'];

  if (database !== 'none') {
    requirements.push('sqlalchemy');
    requirements.push('alembic');
    if (database === 'postgresql')
      requirements.push(useAsync ? 'asyncpg' : 'psycopg2-binary');
    if (database === 'mysql')
      requirements.push(useAsync ? 'aiomysql' : 'mysqlclient');
    if (database === 'sqlite' && useAsync) requirements.push('aiosqlite');
  }

  await utils.createFile(
    `${projectName}/requirements.txt`,
    requirements.join('\n') + '\n'
  );

  // ─── Step 9: Docker ───────────────────────────────────
  if (docker) {
    utils.step(7, 'Creating Docker config');

    const dockerfile = `FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
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

  utils.success(`FastAPI project "${projectName}" created successfully!`);
  utils.log(`  cd ${projectName}`);
  utils.log(`  source venv/bin/activate`);
  utils.log(`  uvicorn app.main:app --reload`);
  utils.log(`  Docs: http://localhost:8000/docs`);
};
