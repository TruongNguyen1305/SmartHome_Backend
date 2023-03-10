import express from 'express'
import * as ScheduleController from '../controllers/ScheduleController.js'
import verifyToken from '../middlewares/authMiddleware.js'

const router = express.Router()
router.get('/:deviceId', verifyToken, ScheduleController.getAllSchedule)
router.post('/:deviceId', verifyToken, ScheduleController.createSchedule)
router.patch('/:deviceId', verifyToken, ScheduleController.editSchedule)
router.delete('/:deviceId/:scheduleId', verifyToken, ScheduleController.deleteSchedule)

export default router