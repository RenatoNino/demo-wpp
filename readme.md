En el archivo `/node_modules/venom-bot/dist/api/layers/sender.layer.js`, añade el siguiente catch en la línea 327:

```javascript
const result = await this.page.evaluate(({ to, content, passId, checkNumber, forcingReturn, delSend }) => {
    return WAPI.sendMessage(to, content, undefined, passId, checkNumber, forcingReturn, delSend);
}, { to, content, passId, checkNumber, forcingReturn, delSend }).catch((error) => {
    reject(error);
});