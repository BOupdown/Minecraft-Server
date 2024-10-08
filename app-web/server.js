const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const app = express();
const PORT = 3000;

function getMinecraftContainers(callback) {
    exec('docker ps --filter "name=minecraft" --format "{{.Names}}"', (error, stdout, stderr) => {
        if (error) {
            console.error('Erreur lors de la récupération des conteneurs:', stderr);
            return callback(error, null);
        }
        // Liste des conteneurs retournée sous forme de tableau
        const containers = stdout.split('\n').filter(name => name !== '');
        callback(null, containers);
    });
}

// Middleware pour servir des fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));



// Route pour lister les conteneurs Minecraft
app.get('/containers', (req, res) => {
    getMinecraftContainers((error, containers) => {
        if (error) {
            return res.status(500).send('Erreur lors de la récupération des conteneurs.');
        }
        res.json(containers);
    });
});

// Route pour démarrer un serveur Minecraft spécifique
app.post('/start/:server', (req, res) => {
    const server = req.params.server;
    exec(`docker start ${server}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Erreur lors du démarrage du serveur ${server}:`, stderr);
            return res.status(500).send(`Erreur : ${stderr}`);
        }
        res.send(`Serveur Minecraft ${server} démarré : ${stdout}`);
    });
});

// Route pour arrêter un serveur Minecraft spécifique
app.post('/stop/:server', (req, res) => {
    const server = req.params.server;
    exec(`docker stop ${server}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Erreur lors de l'arrêt du serveur ${server}:`, stderr);
            return res.status(500).send(`Erreur : ${stderr}`);
        }
        res.send(`Serveur Minecraft ${server} arrêté : ${stdout}`);
    });
});

// Route pour obtenir les logs d'un serveur Minecraft spécifique
app.get('/logs/:server', (req, res) => {
    const server = req.params.server;
    exec(`docker logs ${server}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Erreur lors de la récupération des logs du serveur ${server}:`, stderr);
            return res.status(500).send(`Erreur : ${stderr}`);
        }
        res.send(`<pre>${stdout}</pre>`);
    });
});


app.listen(PORT, () => {
    console.log(`Serveur API écoutant sur le port ${PORT}`);
});
