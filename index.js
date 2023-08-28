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

    const errors = [];
    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      if (typeof message !== 'object' || !message.number || !message.message) {
        errors.push(i);
        continue;
      }

      const destinationNumber = message.number;
      const messageText = message.message;

      if (!/^\d+$/.test(destinationNumber)) {
        errors.push(i);
        continue;
      }

      if (typeof messageText !== 'string' || messageText.length == 0 || messageText.length > 700) {
        errors.push(i);
        continue;
      }
    }
    if (errors.length > 0) res.status(400).json({ errors: errors });


    for (let i = 0; i < messages.length; i++) {
      const destinationNumber = messages[i].number;
      const messageText = messages[i].message;

      try {
        await client.sendText(destinationNumber + '@c.us', messageText);
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        res.status(400).send('Error al enviar mensaje. Posible causa: Desconexión de Whastapp.');
        isSessionOpen = false;
        return ;
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