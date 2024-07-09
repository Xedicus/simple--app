# Simple App

## Description

Ce projet est une application Node.js simple intégrée avec une base de données MySQL. L'application permet de gérer des données simples via une API RESTful. Le projet est conteneurisé à l'aide de Docker et utilise Docker Compose pour orchestrer les services.

## Prérequis

- Node.js (version 18 ou supérieure)
- Docker
- Docker Compose
- Un compte Docker Hub

## Installation

### Installation locale

1. Clonez le dépôt :

   ```sh
   git clone https://github.com/your-username/simple-app.git
   cd simple-app
   ```

2. Installez les dépendances :

   ```sh
   npm install
   ```

3. Créez un fichier `.env` avec les variables d'environnement nécessaires :

   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=root
   DB_NAME=testdb
   ```

4. Démarrez l'application :
   ```sh
   node server.js
   ```

### Utilisation de Docker

1. Construisez et démarrez les conteneurs :

   ```sh
   docker-compose up --build
   ```

2. Accédez à l'application via `http://localhost:3000`.

## CI/CD avec GitHub Actions

Le projet utilise GitHub Actions pour automatiser les tests, la construction de l'image Docker et le déploiement sur Docker Hub.

### Configuration

1. Créez les secrets GitHub pour Docker Hub :

   - `DOCKER_HUB_USERNAME`
   - `DOCKER_HUB_PASSWORD`

2. Poussez les modifications vers la branche `main` pour déclencher le workflow CI/CD.

### Fichier Workflow

Le fichier `.github/workflows/ci-cd.yml` configure le pipeline CI/CD :

- Clone le dépôt.
- Configure Node.js.
- Installe Docker Compose.
- Installe les dépendances Node.js.
- Construit l'image Docker.
- Tag l'image Docker.
- Pousse l'image vers Docker Hub.

```yaml
name: CI/CD Pipeline

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  build_and_test:
    runs-on: ubuntu-latest

    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: root
          MYSQL_DATABASE: testdb
        ports:
          - 3306:3306
        options: >-
          --health-cmd="mysqladmin ping --silent"
          --health-interval=10s
          --health-timeout=5s
          --health-retries=5

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install Docker Compose
        run: |
          sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.2/docker-compose-linux-x86_64" -o /usr/local/bin/docker-compose
          sudo chmod +x /usr/local/bin/docker-compose
          docker-compose --version

      - name: Install dependencies
        run: npm install

      - name: Fix permissions
        run: sudo chown -R $USER:$USER node_modules

      - name: Build Docker images
        run: docker-compose build

      - name: Verify Docker images
        run: docker images

      - name: Tag Docker image
        run: docker tag simple--app_app xedicus13/simple--app:latest

      - name: Publish Docker image
        if: github.ref == 'refs/heads/main'
        run: |
          echo "${{ secrets.DOCKER_HUB_PASSWORD }}" | docker login -u "${{ secrets.DOCKER_HUB_USERNAME }}" --password-stdin
          docker push xedicus13/simple--app:latest
        env:
          DOCKER_HUB_USERNAME: ${{ secrets.DOCKER_HUB_USERNAME }}
          DOCKER_HUB_PASSWORD: ${{ secrets.DOCKER_HUB_PASSWORD }}
```
