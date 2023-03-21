import express from 'express'
import * as DeviceLogController from '../controllers/DeviceLogController.js'

const router = express.Router()
router.route('/').post(DeviceLogController.addDeviceLog)

export default router