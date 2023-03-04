const mqtt = require('mqtt');
AIO_USERNAME = "nguyenphinam2k2"
AIO_KEY = "aio_BaLV51lmatR0BbUpdMHTNtgcEOKA"
AIO_FEED_ID = "bbc-temp"

const mqttClient = mqtt.connect({
    host: `io.adafruit.com`,
    port: 1883,
    username: AIO_USERNAME,
    password: AIO_KEY,
});

mqttClient.subscribe(`${AIO_USERNAME}/feeds/${AIO_FEED_ID}`);

// Handle incoming messages
mqttClient.on('message', (topic, message) => {
    console.log(`Received message on topic "${topic}": ${message.toString()}`);
});

const data = { value: 3 };
mqttClient.publish(`${AIO_USERNAME}/feeds/${AIO_FEED_ID}`, JSON.stringify(data), { qos: 1 }, (err) => {
  if (err) {
    console.error(`Failed to publish data to feed "${AIO_FEED_ID}": ${err}`);
  } else {
    console.log(`Published data to feed "${AIO_FEED_ID}": ${JSON.stringify(data)}`);
  }
});