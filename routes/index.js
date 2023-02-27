import userRouter from './users.js'

export default function route(app) {
    app.use('/api/users', userRouter)
}