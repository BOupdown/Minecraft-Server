minikube start

kubectl run demominecraft --image=boupdown/myminecraftserver

kubectl port-forward pod/demominecraft 25565:25565


