#!/bin/bash

minikube start
# Appliquer le déploiement
kubectl apply -f /deployment/deployment.yml
# Appliquer le service
kubectl apply -f /deployment/service.yml

kubectl port-forward service/demominecraft 25565:25565

