# Le projet

Dans notre projet, on était parti avec pour but de lancer kubectl avec docker et avoir plusieurs pods pour nos serveurs minecraft.
On a finalement décidé de faire un docker-compose qui lance 2 serveurs minecrafts et l'application.
Le site web est accessible en localhost:3000 et permet de gérer les 2 serveurs et de créer un nouveau serveur.
Il faut cliquer sur demarrer quand on selectionne un serveur pour que le site fonctionne correctement.
On a tout de même laissé un script.sh, si vous voulez testé le kubectl qu'on avait fait, qui déploie 2 pods pour un serveur minecraft sur le port 25565:25565.
Les données des mondes Minecraft sont conservées dans data. Donc si on lance un monde, on retrouve ce monde même si on ferme le serveur.

# Lancer le script Kubectl

./script.sh

# lancer le Docker Compose

docker-compose up --build