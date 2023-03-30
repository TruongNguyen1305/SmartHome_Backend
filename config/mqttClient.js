import mqtt from 'mqtt'
import dotenv from 'dotenv'
dotenv.config()

const AIO_USERNAME = process.env.AIO_USERNAME
const AIO_KEY = process.env.AIO_KEY
const AIO_FEED_ID = ['led', 'bbc-fan', 'bbc-door']
const AIO_FEED_SENSOR_ID = ['bbc-temp', 'bbc-humi']
const AIO_FEED_ADJUST_ID = ['bbc-led-light', 'bbc-fan-power']

const mqttClient = mqtt.connect({
    host: `io.adafruit.com`,
    port: 1883,
    username: AIO_USERNAME,
    password: AIO_KEY,
});

mqttClient.on('connect', () => {
    AIO_FEED_ID.map((item) => {
        mqttClient.subscribe(`${AIO_USERNAME}/feeds/${item}`);
        console.log(`Connected ${item} to Adafruit IO`);
    })

    AIO_FEED_SENSOR_ID.map((item) => {
        mqttClient.subscribe(`${AIO_USERNAME}/feeds/${item}`);
        console.log(`Connected ${item} to Adafruit`)
    })

    AIO_FEED_ADJUST_ID.map((item) => {
        mqttClient.subscribe(`${AIO_USERNAME}/feeds/${item}`);
        console.log(`Connected ${item} to Adafruit IO`);
    })
    // Đăng ký chủ đề để nhận giá trị từ feed
});

export {
    mqttClient,
    AIO_USERNAME
}