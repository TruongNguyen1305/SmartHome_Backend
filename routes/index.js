import userRouter from './users.js'
import scheduleRouter from './schedule.js'
import deviceLogRouter from './devicelog.js'
import deviceRouter from './device.js'

export default function route(app) {
    app.use('/api/users', userRouter)
    app.use('/api/schedules', scheduleRouter)
    app.use('/api/devicelog', deviceLogRouter)
    app.use('/api/device', deviceRouter)
}