const express = require('express');
const app = express();
const port = 3000;

// Route pour la racine
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Contrôle du serveur Minecraft</title>
            <script>
                function startServer() {
                    fetch('/start')
                        .then(response => response.text())
                        .then(data => {
                            alert(data);
                        })
                        .catch(error => console.error('Erreur:', error));
                }

                function stopServer() {
                    fetch('/stop')
                        .then(response => response.text())
                        .then(data => {
                            alert(data);
                        })
                        .catch(error => console.error('Erreur:', error));
                }
            </script>
        </head>
        <body>
            <h1>Bienvenue sur le serveur Minecraft!</h1>
            <button onclick="startServer()">Démarrer le serveur</button>
            <button onclick="stopServer()">Arrêter le serveur</button>
        </body>
        </html>
    `);
});

// Fonctionnalité pour démarrer le serveur
app.get('/start', (req, res) => {
    // Logique pour démarrer le serveur Minecraft
    res.send('Serveur Minecraft démarré!');
});

// Fonctionnalité pour arrêter le serveur
app.get('/stop', (req, res) => {
    // Logique pour arrêter le serveur Minecraft
    res.send('Serveur Minecraft arrêté!');
});

// Démarrage de l'application
app.listen(port, () => {
    console.log(`L'application écoute sur http://localhost:${port}`);
});
