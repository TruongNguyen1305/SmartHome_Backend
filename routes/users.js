import express from 'express'
import * as UserController from '../controllers/UserController.js'
import verifyToken from '../middlewares/authMiddleware.js'


const router = express.Router()
router.route('/').post(UserController.registerUser).get(verifyToken, UserController.getAllUsers)
router.get('/test',UserController.getAllUsers)
router.post('/login',UserController.authUser)
router.put('/setpin',UserController.setPin)
router.post('/addface',UserController.addFace)
router.post('/deleteface',UserController.deleteFace)
router.get('/getface/:id',UserController.getFace)


export default router