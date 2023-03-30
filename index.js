import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import express from 'express'
import route from './routes/index.js'
import mongoose from 'mongoose'
import { notFound, errorHandler } from './middlewares/errorMiddleware.js'
import cors from 'cors'
import User from './models/User.js'
import Schedule from './models/Schedule.js'
import scheduler from  'node-schedule'
import { mqttClient, AIO_USERNAME } from './config/mqttClient.js'
// Socket.io
import { Server } from "socket.io";
import { createServer } from "http";

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


/////////////////////////////////////////////////////////////////
const httpServer = createServer(app);
const io = new Server(httpServer);
io.on("connection", (socket) => {
    console.log('An user connted to server Socket.io');

    socket.on('setup', (userId)=> {
        socket.leave(userId)
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
    scheduler.scheduleJob('0 1 28 * *', async ()=>{
        const date = new Date()
        await Schedule.deleteMany({
            timeSchedule: { $lte: date }
        })
        console.log(`Clear schedule per month (${date.getMonth() + 1})`)
    }) //clear schedule per day 28 of month

    httpServer.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`)
    })
}) 
.catch(error =>{
    console.log(`Server error: ${error}`)
})




