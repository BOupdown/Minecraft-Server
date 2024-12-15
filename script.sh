#!/bin/bash

# Démarre Minikube
minikube start && \
kubectl apply -f deployment/deployment.yml && \
kubectl apply -f deployment/service.yml && \
kubectl port-forward service/demominecraft 25565:25565