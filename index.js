// Supports ES6
// import { create, Whatsapp } from 'venom-bot';
const venom = require('venom-bot');

venom
  .create({
    session: 'session-name' //name of session
  })
  .then((client) => start(client))
  /* .catch((erro) => {
    console.log(erro);
  }) */;

function start(client) {
    setInterval(() => {
        const destinationNumber = '51920648575@c.us'; // Agrega @c.us al final del número
        const message = '¡Este es un mensaje enviado automáticamente cada 10 segundos!';
        
        // Enviar el mensaje
        client.sendText(destinationNumber, message)
          .then((result) => {
            console.log('Mensaje enviado: ', result); // Devuelve el objeto de éxito
          })
          .catch((error) => {
            console.error('Error al enviar mensaje: ', error); // Devuelve el objeto de error
          });
      }, 10000); // Intervalo de 10000 milisegundos (10 segundos)

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
//         client.sendText(destinationNumber, 'Mensaje enviado al número 51920648575');
//     }
//   });
}