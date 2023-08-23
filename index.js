// Supports ES6
const express = require('express');
const app = express();
const port = 3005; // Puedes cambiar el puerto si es necesario
app.use(express.json()); // Middleware para parsear JSON en las solicitudes

// import { create, Whatsapp } from 'venom-bot';
const venom = require('venom-bot');
var client = null;
venom
  .create({
    session: 'session-name'
  })
  .then((cl) => {
    client = cl;
  });

// function start(client) {
//     setInterval(() => {
//         const destinationNumber = '51920648575@c.us';
//         const message = '¡Este es un mensaje enviado automáticamente cada 10 segundos!';
        
//         client.sendText(destinationNumber, message)
//           .then((result) => {
//             console.log('Mensaje enviado: ', result);
//           })
//           .catch((error) => {
//             console.error('Error al enviar mensaje: ', error);
//           });
//       }, 10000);

//   client.onMessage((message) => {
//     console.log(message);
//     if (message.body === 'Hi' && message.isGroupMsg === false) {
//         const destinationNumber = '51920648575' + '@c.us';
//       client.sendText(message.from, 'Welcome Venom 🕷');
//         // .then((result) => {
//         //   console.log('Result: ', result); //return object success
//         // })
//         // .catch((erro) => {
//         //   console.error('Error when sending: ', erro); //return object error
//         // });
//       client.sendText(destinationNumber, 'Mensaje enviado al número 51920648575');
//     }
//   });
// }


app.post('/send-message', (req, res) => {
  if(!client) {
    res.status(500).send('Aún no se ha realizado la conexión a whatsapp.');
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