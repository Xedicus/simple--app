# Étape 1 : Construire l'application
FROM node:14 AS builder

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json dans le répertoire de travail
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le contenu du projet dans le répertoire de travail
COPY . .

# Étape 2 : Exécuter l'application
FROM node:14-alpine

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les dépendances installées et le code de l'application depuis l'étape de build
COPY --from=builder /app /app

# Exposer le port que l'application va utiliser
EXPOSE 3000

# Démarrer l'application
CMD ["node", "server.js"]
