import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import express from 'express'
import route from './routes/index.js'
import mongoose from 'mongoose'
import { notFound, errorHandler } from './middlewares/errorMiddleware.js'


dotenv.config()
const app = express()

//Add middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

route(app)
//Add middleware to catch errors
app.use(notFound)
app.use(errorHandler)
const PORT = process.env.PORT || 5000

mongoose.connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() =>{
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`)
    })
})
.catch(error =>{
    console.log(`Server error: ${error}`)
})
