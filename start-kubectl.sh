#!/bin/bash

minikube start --driver=docker
# Appliquer le déploiement
kubectl apply -f app/deployment/deployment.yml
# Appliquer le service
kubectl apply -f app/deployment/service.yml

kubectl port-forward service/demominecraft 25565:25565

