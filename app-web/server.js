const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

function getMinecraftContainers(callback) {
    console.log("Starting container retrieval...");

    exec('docker ps --filter "name=minecraft" --format "{{.Names}}"', (error, stdout, stderr) => {
        if (error) {
            console.error("Error retrieving Minecraft containers list:", stderr);
            return callback(error, null);
        }

        const containers = stdout.split('\n').filter(name => name !== '');
        const containersWithDetails = [];
        let processedContainers = 0;

        if (containers.length === 0) {
            console.log("No containers found.");
            return callback(null, []);
        }

        console.log(`Found ${containers.length} container(s):`, containers);

        containers.forEach(container => {
            const inspectCommand = `docker inspect --format '{{.Name}} - {{if .NetworkSettings.IPAddress}}{{.NetworkSettings.IPAddress}}{{else}}Host Network{{end}} - {{if (index (index .NetworkSettings.Ports "25565/tcp") 0)}}{{(index (index .NetworkSettings.Ports "25565/tcp") 0).HostPort}}{{else}}No Port Mapping{{end}}' ${container}`;
            console.log(`Running inspect command: ${inspectCommand}`);

            exec(inspectCommand, (err, portStdout, portStderr) => {
                if (err) {
                    console.error(`Error inspecting container ${container}:`, portStderr);
                    processedContainers++;
                    if (processedContainers === containers.length) {
                        callback(null, containersWithDetails);
                    }
                    return;
                }

                console.log(`Inspect result for ${container}:`, portStdout);

                const [name, ip, port] = portStdout.split(' - ');
                containersWithDetails.push({
                    name: name.replace('/', ''),
                    ip: ip.trim(),
                    port: port.trim()
                });

                processedContainers++;

                if (processedContainers === containers.length) {
                    console.log("All containers processed:", containersWithDetails);
                    callback(null, containersWithDetails);
                }
            });
        });
    });
}



function updateServerStatus(serverName, status) {
    const servers = JSON.parse(fs.readFileSync('servers.json', 'utf8'));
    const server = servers.find(s => s.name === serverName);

    if (server) {
        server.status = status;
    } else {
        servers.push({ name: serverName, status: status });
    }

    fs.writeFileSync('servers.json', JSON.stringify(servers, null, 2));
}

app.use(express.static(path.join(__dirname, 'public')));

app.get('/containers', (req, res) => {
    exec('docker ps --filter "name=minecraft" --format "{{.Names}}"', (error, stdout, stderr) => {
        if (error) {
            console.error("Error retrieving Minecraft containers list:", stderr);
            return res.json([]); 
        }

        const containers = stdout.split('\n').filter(name => name.trim() !== '');
        const containersWithDetails = [];
        let processedContainers = 0;

        if (containers.length === 0) {
            console.log("No containers found.");
            return res.json([]);
        }

        console.log(`Found ${containers.length} container(s):`, containers);

        containers.forEach(container => {
            const inspectCommand = `
                docker inspect --format '{{.Name}}|{{range $key, $value := .NetworkSettings.Networks}}{{$value.IPAddress}}{{end}}|{{range $key, $value := (index .NetworkSettings.Ports "25565/tcp")}}{{$value.HostPort}}{{end}}' ${container}
            `.trim();

            console.log(`Running inspect command: ${inspectCommand}`);

            exec(inspectCommand, (err, portStdout, portStderr) => {
                processedContainers++;

                if (err) {
                    console.error(`Error inspecting container ${container}:`, portStderr);
                } else {
                    console.log(`Inspect result for ${container}:`, portStdout);

                    const details = portStdout.trim().split('|');
                    if (details.length === 3) {
                        const [name, ip, port] = details.map(str => str.trim());
                        containersWithDetails.push({
                            name: name.replace('/', ''),
                            ip: ip || 'No IP',         
                            port: port || 'No Port Mapping' 
                        });
                    }
                }

                if (processedContainers === containers.length) {
                    console.log("All containers processed:", containersWithDetails);
                    res.json(containersWithDetails);
                }
            });
        });
    });
});



app.post('/start/:server', (req, res) => {
    const server = req.params.server;
    exec(`docker start ${server}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Erreur lors du démarrage du serveur ${server}:`, stderr);
            return res.status(500).send(`Erreur : ${stderr}`);
        }
        res.send(`Serveur Minecraft ${server} démarré.`);
    });
});

app.post('/stop/:server', (req, res) => {
    const server = req.params.server;
    exec(`docker stop ${server}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Erreur lors de l'arrêt du serveur ${server}:`, stderr);
            return res.status(500).send(`Erreur : ${stderr}`);
        }
        res.send(`Serveur Minecraft ${server} arrêté.`);
    });
});

app.get('/logs/:server', (req, res) => {
    const server = req.params.server;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const logStream = exec(`docker logs -f ${server}`);

    logStream.stdout.on('data', (data) => {
        res.write(`data: ${data}\n\n`); 
    });

    logStream.stderr.on('data', (data) => {
        res.write(`data: ${data}\n\n`);
    });

    logStream.on('close', () => {
        res.write('event: close\n');
        res.write('data: Log stream closed.\n\n');
        res.end();
    });

    req.on('close', () => {
        logStream.kill();
    });
});


app.post('/add-server', (req, res) => {
    const newServerName = `minecraft-server${Date.now()}`;
    const hostPort = 25568;  // port fixe

    exec(`docker run -d -p ${hostPort}:25565 --name ${newServerName} -e EULA=TRUE itzg/minecraft-server`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Erreur lors de l'ajout du serveur: ${stderr}`);
            return res.status(500).json({ error: 'Erreur lors de l\'ajout du serveur' });
        }
        res.json({ serverName: newServerName, port: hostPort });
    });
});


app.get('/status/:containerId', (req, res) => {
    const containerId = req.params.containerId;

    exec(`docker inspect --format '{{.State.Status}}' ${containerId}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Erreur lors de la vérification du statut du conteneur: ${stderr}`);
            return res.status(500).json({ error: 'Erreur lors de la vérification du statut' });
        }

        const status = stdout.trim();
        res.json({ status });
    });
});



function getMinecraftContainers(callback) {
    exec('docker ps --filter "name=minecraft" --format "{{.Names}}"', (error, stdout, stderr) => {
        if (error) {
            console.error('Erreur lors de la récupération des conteneurs:', stderr);
            return callback(error, null);
        }
        const containers = stdout.split('\n').filter(name => name !== '');
        callback(null, containers);
    });
}


app.listen(PORT, () => {
    console.log(`Serveur API écoutant sur le port ${PORT}`);
});
