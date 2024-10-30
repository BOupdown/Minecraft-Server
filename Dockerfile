# Utiliser une image de base avec Python
FROM ubuntu:latest

# Mettre à jour les paquets et installer Python et pip
RUN apt-get update && \
    apt-get install -y python3 python3-pip

# Copier tous les fichiers dans le répertoire /app
COPY . /app

# Copier requirements.txt dans /app
COPY requirements.txt ./app/requirements.txt

# Changer le répertoire de travail
WORKDIR /app

# Installer les dépendances
RUN pip3 install -r requirements.txt

# Donner les permissions d'exécution au script
RUN chmod +x /script.sh
