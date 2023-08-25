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

app.post('/send-message', (req, res) => {
  if(!isSessionOpen) {
    res.status(500).send('La sesión está cerrada. Escanea un nuevo código QR.');
  } else {
    const destinationNumber = req.body.number;
    const message = req.body.message;

    client.sendText(destinationNumber + '@c.us', message)
      .then((result) => {
        res.status(200).send('Mensaje enviado con éxito');
      })
      .catch((error) => {
        /* 
          Añadir catch en la siguiente función: /node_modules/venom-bot/dist/api/layers/sender.layer.js::327
          const result = await this.page.evaluate(({ to, content, passId, checkNumber, forcingReturn, delSend }) => {
                return WAPI.sendMessage(to, content, undefined, passId, checkNumber, forcingReturn, delSend);
            }, { to, content, passId, checkNumber, forcingReturn, delSend }).catch((error) => {
                reject(error);
            });
        */

        // console.log('Error al enviar mensaje: ');
        // console.log(error);
        res.status(500).send('Error al enviar mensaje. Posible causa: Desconexión de Whastapp.');
      });
  }
});

app.post('/create-qr', (req, res) => {
  if(client){
    client.close()
    .then(() => {
      isSessionOpen = false;

      venom
      .create({
        session: 'session-name',
        catchQR: (base64Qr, asciiQR) => {
          console.log('Escanea este código QR:');
          console.log(asciiQR);
          res.status(200).send(asciiQR);
        },
      })
      .then(async (cl) => {
        client = cl;
        isSessionOpen = true;
      });
    })
    .catch((error) => {
      console.error('Error al cerrar la sesión:', error);
    });
  } else {
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
  }

});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});