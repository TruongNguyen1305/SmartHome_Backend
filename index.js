import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import express from 'express'
import route from './routes/index.js'
import mongoose from 'mongoose'
import { notFound, errorHandler } from './middlewares/errorMiddleware.js'
import cors from 'cors'
import User from './models/User.js'

// Socket.io
import { Server } from "socket.io";
import { createServer } from "http";

// MQTT
import mqtt from 'mqtt'

/////////////////////////////////////////////////////////////////
dotenv.config() 
const app = express()

//Add middleware
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

route(app)
//Add middleware to catch errors
app.use(notFound)
app.use(errorHandler)
const PORT = process.env.PORT || 5000
/////////////////////////////////////////////////////////////////
const AIO_USERNAME = process.env.AIO_USERNAME
const AIO_KEY = process.env.AIO_KEY
const AIO_FEED_ID = ['led','bbc-fan', 'bbc-door']
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
///////////////////////////////////////////////////////////////
const httpServer = createServer(app);
const io = new Server(httpServer);
io.on("connection", (socket) => {
    console.log('An user connted to server Socket.io');

    socket.on('setup', (userId)=> {
        socket.join(userId)
        console.log(`User ${userId} connected`)
    })

    socket.on('send notif', async (data, homeID)=>{
        console.log('send notif')
        const users = await User.find({
            homeID
        })
        users.forEach(user => {
            if (user._id.toString() === data.creatorID) return
            socket.to(user._id.toString()).emit('notif received', data)
        })
    })

    socket.on('logout', (userId)=>{
        console.log(`User ${userId} logged out`)
        socket.leave(userId)
    })

    mqttClient.on('message', (topic, message) => {
        console.log(topic)
        const parsedTopic = topic.split('/');
        console.log('gui du lieu từ', parsedTopic[2], message)
        socket.emit(`toggle ${parsedTopic[2]}`, message.toString())
    });

    socket.on("toggleswitch", (data, name) => {
        mqttClient.publish(`${AIO_USERNAME}/feeds/${name}`, JSON.stringify(parseInt(data)), { qos: 1 }, (err) => {
            if (err) {
                console.error(`Failed to publish data to feed "${name}": ${err}`);
            } else {
                console.log(`Published data to feed "${name}": ${JSON.stringify(data)}`);
            }
        });
    })

    socket.on("adjust value", (data, name) => {
        console.log('nhận đc thay đổi', data, name)
        mqttClient.publish(`${AIO_USERNAME}/feeds/${name}`, JSON.stringify(parseInt(data)), { qos: 1 }, (err) => {
            if (err) {
                console.error(`Failed to publish data to feed "${name}": ${err}`);
            } else {
                console.log(`Published data to feed "${name}": ${JSON.stringify(data)}`);
            }
        });
    })
    
});
//////////////////////////////////////////////////////////////////
mongoose.connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() =>{
    httpServer.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`)
    })
}) 
.catch(error =>{
    console.log(`Server error: ${error}`)
})




