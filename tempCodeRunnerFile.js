const data = { value: 3 };
// mqttClient.publish(`${AIO_USERNAME}/feeds/${AIO_FEED_ID}`, JSON.stringify(data), { qos: 1 }, (err) => {
//   if (err) {
//     console.error(`Failed to publish data to feed "${AIO_FEED_ID}": ${err}`);
//   } else {
//     console.log(`Published data to feed "${AIO_FEED_ID}": ${JSON.stringify(data)}`);
//   }
// });