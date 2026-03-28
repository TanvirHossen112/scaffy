export default async (answers, utils) => {
  const { projectName, database, docker } = answers;

  utils.title('Creating Gin v1 Project');

  // ─── Step 1: Create project folder ────────────────────
  utils.step(1, 'Creating project structure');
  await utils.run(`mkdir ${projectName}`);

  // ─── Step 2: Initialize Go module ─────────────────────
  utils.step(2, 'Initializing Go module');
  await utils.runInProject(projectName, `go mod init ${projectName}`);

  // ─── Step 3: Install Gin ───────────────────────────────
  utils.step(3, 'Installing Gin');
  await utils.runInProject(projectName, 'go get github.com/gin-gonic/gin');

  // ─── Step 4: Database ─────────────────────────────────
  if (database !== 'none') {
    utils.step(4, 'Installing database dependencies');
    await utils.runInProject(projectName, 'go get gorm.io/gorm');

    if (database === 'postgresql') {
      await utils.runInProject(projectName, 'go get gorm.io/driver/postgres');
    }

    if (database === 'mysql') {
      await utils.runInProject(projectName, 'go get gorm.io/driver/mysql');
    }

    if (database === 'sqlite') {
      await utils.runInProject(projectName, 'go get gorm.io/driver/sqlite');
    }
  }

  // ─── Step 5: Generate main.go ─────────────────────────
  utils.step(5, 'Generating application files');

  const mainGo = `package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "Hello from ${projectName}",
		})
	})

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status": "ok",
		})
	})

	r.Run(":8080")
}
`;

  await utils.createFile(`${projectName}/main.go`, mainGo);

  // ─── Step 6: Generate database.go if needed ───────────
  if (database !== 'none') {
    const dsnMap = {
      postgresql: `host=localhost user=postgres password=password dbname=${projectName} port=5432 sslmode=disable`,
      mysql: `user:password@tcp(localhost:3306)/${projectName}?charset=utf8mb4&parseTime=True&loc=Local`,
      sqlite: `${projectName}.db`,
    };

    const driverMap = {
      postgresql: 'postgres',
      mysql: 'mysql',
      sqlite: 'sqlite',
    };

    const databaseGo = `package main

import (
	"log"

	"gorm.io/driver/${driverMap[database]}"
	"gorm.io/gorm"
)

var DB *gorm.DB

func initDB() {
	dsn := "${dsnMap[database]}"
	db, err := gorm.Open(${driverMap[database]}.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	DB = db
}
`;
    await utils.createFile(`${projectName}/database.go`, databaseGo);
  }

  // ─── Step 7: Generate .gitignore ──────────────────────
  const gitignore = `# Binaries
${projectName}
*.exe
*.exe~
*.dll
*.so
*.dylib

# Test binary
*.test

# Output of go coverage tool
*.out

# Environment
.env

# IDE
.vscode/
.idea/
`;
  await utils.createFile(`${projectName}/.gitignore`, gitignore);

  // ─── Step 8: Docker ───────────────────────────────────
  if (docker) {
    utils.step(6, 'Creating Docker config');

    const dockerfile = `FROM golang:1.21-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go build -o main .

FROM alpine:latest

WORKDIR /app
COPY --from=builder /app/main .

EXPOSE 8080
CMD ["./main"]
`;

    const dockerCompose = `version: '3.8'
services:
  web:
    build: .
    ports:
      - "8080:8080"
    depends_on:
      - db
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

  // ─── Step 9: go mod tidy ──────────────────────────────
  utils.step(7, 'Tidying Go modules');
  await utils.runInProject(projectName, 'go mod tidy');

  utils.success(`Gin v1 project "${projectName}" created successfully!`);
  utils.log(`  cd ${projectName}`);
  utils.log(`  go run main.go`);
  utils.log(`  Server running at http://localhost:8080`);
};
