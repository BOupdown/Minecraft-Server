# Utiliser l'image officielle Node.js
FROM node:16

# Installer Docker
RUN apt-get update && apt-get install -y \
    docker.io \
    && apt-get clean

# Créer le répertoire de l'application
WORKDIR /usr/src/app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers de l'application
COPY . .

# Exposer le port sur lequel l'application écoute
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["node", "server.js"]
