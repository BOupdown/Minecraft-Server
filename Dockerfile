# Utiliser une image de base avec Ubuntu
FROM ubuntu:latest

# Mettre à jour les paquets et installer curl, python, pip, venv et docker
RUN apt-get update && \
    apt-get install -y curl python3 python3-pip python3-venv docker.io && \
    apt-get clean

# Installer Minikube
RUN curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64 && \
    install minikube-linux-amd64 /usr/local/bin/minikube && rm minikube-linux-amd64

# Installer kubectl
RUN curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl" && \
    curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl.sha256" && \
    install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Copier tous les fichiers dans le répertoire /app
COPY . /app/

# Donner les permissions d'exécution au script
RUN chmod +x /app/start-kubectl.sh

# Définir la commande à exécuter
CMD ["bash", "/app/start-kubectl.sh"]
