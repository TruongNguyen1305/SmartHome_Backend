import userRouter from './users.js'
import scheduleRouter from './schedule.js'

export default function route(app) {
    app.use('/api/users', userRouter)
    app.use('/api/schedules', scheduleRouter)
}