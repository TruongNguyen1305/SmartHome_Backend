import express from 'express'
import * as DeviceController from '../controllers/DeviceController.js'

const router = express.Router()
router.route('/').get(DeviceController.getAllDevice)
router.route('/add').post(DeviceController.addDevice)
router.route('/value').put(DeviceController.changeAutomaticValue)
router.route('/mode').put(DeviceController.toggleAutomaticMode)

export default router 