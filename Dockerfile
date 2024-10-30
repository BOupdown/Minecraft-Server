# Étape 1 : Utiliser l'image de kubectl
FROM ubuntu:latest

# Étape 2 : Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers requis dans le conteneur
COPY . /app

# Installer les dépendances
RUN pip install -r requirements.txt

# Lancer le script start-kubectl.sh
CMD ["sh", "./start-kubectl.sh"]
