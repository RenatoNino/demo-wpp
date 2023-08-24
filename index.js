// Supports ES6
const express = require('express');
const app = express();
const port = 3005; // Puedes cambiar el puerto si es necesario
app.use(express.json()); // Middleware para parsear JSON en las solicitudes

// import { create, Whatsapp } from 'venom-bot';
const venom = require('venom-bot');
let client = null;
let isSessionOpen = false;

venom
  .create({
    session: 'session-name',
    // catchQR: (base64Qr, asciiQR) => {
    //   // Cuando se necesita el escaneo del código QR, puedes enviarlo al cliente
    //   // base64Qr contiene el código QR en formato base64
    //   // asciiQR contiene el código QR en formato ASCII
    //   console.log('Escanea este código QR:', asciiQR);
    // },
    statusFind: (statusGet, session, info) => {
      console.log("Cambio en la sesión")
      console.log(statusGet)
    }
  })
  .then((cl) => {
    client = cl;
    isSessionOpen = true;

    cl.onStateChange((state) => {
      console.log('Cambió el estado de la sesión:');
      console.log(state);
      if (state === 'CONFLICT' || state === 'UNPAIRED' || state === 'UNLAUNCHED') {
        isSessionOpen = false;
        console.log('Sesión cerrada.');
      }
    });
  });

app.post('/send-message', (req, res) => {
  if(!isSessionOpen) {
    res.status(500).send('La sesión está cerrada. Escanea un nuevo código QR.');
  } else {
    const destinationNumber = req.body.number;
    const message = req.body.message;

    client.sendText(destinationNumber + '@c.us', message)
      .then((result) => {
        console.log('Mensaje enviado: ', result);
        res.status(200).send('Mensaje enviado con éxito');
      })
      .catch((error) => {
        console.error('Error al enviar mensaje: ', error);
        res.status(500).send('Error al enviar mensaje');
    });
  }
});


app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});