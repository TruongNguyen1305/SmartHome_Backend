import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import express from 'express'
import route from './routes/index.js'
import mongoose from 'mongoose'
import { notFound, errorHandler } from './middlewares/errorMiddleware.js'
import cors from 'cors'

// Socket.io
import { Server } from "socket.io";
import { createServer } from "http";

// MQTT
import mqtt from 'mqtt'
const AIO_USERNAME = "nguyenphinam2k2"
const AIO_KEY = "aio_rNnp068oGqZlonmhqELdr0JnvCmJ"
const AIO_FEED_ID = "bbc-led"


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
const mqttClient = mqtt.connect({
    host: `io.adafruit.com`,
    port: 1883,
    username: AIO_USERNAME,
    password: AIO_KEY,
});
mqttClient.subscribe(`${AIO_USERNAME}/feeds/${AIO_FEED_ID}`);

///////////////////////////////////////////////////////////////
const httpServer = createServer(app);
const io = new Server(httpServer);

io.on("connection", (socket) => {
    console.log('a user connected');
    socket.emit("hello from server", 1, "2", { 3: Buffer.from([4]) });

    // receive a message from the client
    socket.on("chat message", (...args) => {
        console.log('help from client')
    });
    
    mqttClient.on('message', (topic, message) => {
        console.log('gui du lieu nek')
        io.emit('sensor-data', message.toString())
    });

    socket.on("toggleswitch", (data) => {
        console.log('nhận đc toggle', data)
            
        mqttClient.publish(`${AIO_USERNAME}/feeds/${AIO_FEED_ID}`, JSON.stringify(parseInt(data)), { qos: 1 }, (err) => {
            if (err) {
            console.error(`Failed to publish data to feed "${AIO_FEED_ID}": ${err}`);
            } else {
            console.log(`Published data to feed "${AIO_FEED_ID}": ${JSON.stringify(data)}`);
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





