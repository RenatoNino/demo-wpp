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
    // catchQR: (base64Qr, asciiQR) => {
    //   // Cuando se necesita el escaneo del código QR, puedes enviarlo al cliente
    //   // base64Qr contiene el código QR en formato base64
    //   // asciiQR contiene el código QR en formato ASCII
    //   console.log('Escanea este código QR:', asciiQR);
    // },
    // statusFind: (statusGet, session, info) => {
    //   console.log("Cambio en la sesión")
    //   console.log(statusGet)
    // }
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
        // console.log('Mensaje enviado: ', result);
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
  client.close()
    .then(() => {
      isSessionOpen = false;

      venom
      .create({
        session: 'session-name',
        catchQR: (base64Qr, asciiQR) => {
          // Cuando se necesita el escaneo del código QR, puedes enviarlo al cliente
          // base64Qr contiene el código QR en formato base64
          // asciiQR contiene el código QR en formato ASCII
          console.log('Escanea este código QR:');
          console.log(asciiQR);
          res.status(200).send(asciiQR);
        },
        // statusFind: (statusGet, session, info) => {
        //   console.log("Cambio en la sesión")
        //   console.log(statusGet)
        // }
      })
      .then(async (cl) => {
        client = cl;
        isSessionOpen = true;
      });
    })
    .catch((error) => {
      console.error('Error al cerrar la sesión:', error);
    });

});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});