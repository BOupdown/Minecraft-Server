#!/bin/bash


if ! command -v minikube &>/dev/null; then
  echo "Minikube n'est pas installé. Veuillez l'installer avant de continuer."
  exit 1
fi

if ! command -v kubectl &>/dev/null; then
  echo "kubectl n'est pas installé. Veuillez l'installer avant de continuer."
  exit 1
fi


# Vérifier si Minikube est déjà démarré, sinon démarrer Minikube
if ! minikube status &>/dev/null; then
  echo "Minikube n'est pas démarré, démarrage du cluster..."
  minikube start --driver=none
else
  echo "Minikube est déjà démarré."
fi

# Configurer kubectl pour utiliser le cluster Minikube
echo "Configuration de kubectl pour utiliser le contexte minikube..."
kubectl config use-context minikube

# Vérifier l'état des nœuds du cluster Kubernetes
echo "Vérification des nœuds du cluster..."
kubectl get nodes || { echo "Erreur lors de la récupération des nœuds Kubernetes"; exit 1; }

# Appliquer les fichiers de configuration Kubernetes
echo "Application des fichiers de configuration Kubernetes..."
kubectl apply -f /app/deployment/deployment.yml || { echo "Erreur lors de l'application de deployment.yml"; exit 1; }
kubectl apply -f /app/deployment/service.yml || { echo "Erreur lors de l'application de service.yml"; exit 1; }

# Faire le port-forwarding du service Minecraft
echo "Mise en place du port-forwarding du service Minecraft..."
kubectl port-forward service/demominecraft 25565:25565 || { echo "Erreur lors du port-forwarding"; exit 1; }
