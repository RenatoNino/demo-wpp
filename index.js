// Supports ES6
const express = require('express');
const app = express();
const port = 3005;
app.use(express.json());

const venom = require('venom-bot');
let client = null;
let isSessionOpen = false;

venom
  .create({
    session: 'session-name',
  })
  .then(async (cl) => {
    client = cl;
    isSessionOpen = true;
  });

app.post('/send-message', async (req, res) => {
    if (!isSessionOpen) {
      res.status(500).send('La sesión está cerrada. Escanea un nuevo código QR.');
    } else {
      const messages = req.body.messages;
      for (let i = 0; i < messages.length; i++) {
        const destinationNumber = messages[i].number;
        const message = messages[i].message;

        try {
          await client.sendText(destinationNumber + '@c.us', message);
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          res.status(500).send('Error al enviar mensaje. Posible causa: Desconexión de Whastapp.');
          isSessionOpen = false;
          break;
        }
      }

      res.status(200).send('Mensajes enviados con éxito.');
    }
});
  

app.post('/create-qr', async (req, res) => {
  if(client) await client.close();
  
  isSessionOpen = false;
  venom
  .create({
    session: 'session-name',
    catchQR: (base64Qr, asciiQR) => {
      // console.log('Escanea este código QR:');
      // console.log(asciiQR);
      res.status(200).send(asciiQR);
    },
  })
  .then(async (cl) => {
    client = cl;
    isSessionOpen = true;
  });

});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});