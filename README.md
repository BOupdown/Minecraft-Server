# Le projet

Dans notre projet, on était parti avec pour but de lancer kubectl avec docker et avoir plusieurs pods pour nos serveurs minecraft.
On a malheureusement eu du mal à faire marcher kubectl avec docker.
On a donc décidé de de faire docker-compose qui lance 2 serveurs minecrafts et l'application.
Le site web est accessible en localhost:3000 et permet de gérer les 2 serveurs en questions et de créer un nouveau serveur.
Il faut cliquer sur demarrer quand on selectionne un docker pour que le site fonctionne correctement.
On a tout de même laissé un script.sh qui déploie 2 pods pour un serveur minecraft le port 25565:25565.
Les données des mondes Minecraft sont conservées dans data. Donc si on lance un monde, on retrouve ce monde même si on ferme le server.

# Lancer le script Kubectl

./script.sh

# lancer le Docker Compose

docker-compose up --build