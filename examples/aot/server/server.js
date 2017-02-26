const express = require('express');
const path = require('path');
const http = require('http');
const port = 3000;

const app = express();

app.use('/fr', express.static(path.join(__dirname, '../dist/fr')));
app.use('/es-ES', express.static(path.join(__dirname, '../dist/es-ES')));
app.use('/en', express.static(path.join(__dirname, '../dist/en')));
app.use('/es-ar', express.static(path.join(__dirname, '../dist/es-ar')));

app.get('*', (req, res) => {
  const lang = req.params[0].substring(1);

  if (!lang) {
    res.redirect('/en');
  }
});

app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => console.log(`API running on localhost: ${port}`));
