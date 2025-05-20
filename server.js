const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname)));

// Route principale
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Démarrer le serveur sur toutes les interfaces
app.listen(port, '0.0.0.0', () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
    console.log(`Accessible sur votre réseau local via votre adresse IP`);
}); 