import Schedule from "../models/Schedule.js";

//[GET] /api/schedules/:deviceId
export const getAllSchedule = async (req, res, next) => {
    const {deviceId} = req.params
    try {
        const schedules = await Schedule.find({ 
            deviceId, 
            timeSchedule:  {$gte: new Date()}
        })
        .sort({ timeSchedule: 1 })
        res.status(200).json(schedules)
    } catch (error) {
        next(error)
    }
}

//[POST] /api/schedules/:deviceId
export const createSchedule = async (req, res, next) => {
    const { action, timeSchedule } = req.body
    const {deviceId} = req.params
    console.log(deviceId)
    try {
        const schedules = await Schedule.find({ deviceId })
        schedules.map(schedule => {
            if (schedule.timeSchedule.toString() === timeSchedule.toString()) {
                throw new Error(`Schedule is duplicated`)
            }
        })

        const newSchedule = new Schedule({ deviceId, creator: req.user._id, action, timeSchedule })
        await newSchedule.save()
        res.status(201).json(await Schedule.find({ deviceId }).sort({ timeSchedule: 1 }))
    } catch (error) {
        next(error)
    }
}

//[PATCH] /api/schedules/:deviceId/:scheduleId
export const editSchedule = async (req, res, next) => {
    const { action, timeSchedule } = req.body
    const { deviceId, scheduleId } = req.params
    try {
        const schedules = await Schedule.find({ deviceId })
        schedules.map(schedule => {
            if (schedule.timeSchedule.toString() === timeSchedule.toString() && schedule._id !== scheduleId) {
                throw new Error(`Schedule is duplicated`)
            }
        })

        await Schedule.findByIdAndUpdate(scheduleId, {
            creator: req.user._id, 
            action, 
            timeSchedule
        })
        res.status(200).json(await Schedule.find({ deviceId }).sort({ timeSchedule: 1}))
    } catch (error) {
        next(error)
    }
}

//[PATCH] /api/schedules/:deviceId/:scheduleId/toggle
export const toggleSchedule = async (req, res, next) => {
    console.log('cc')
    const { status } = req.body
    const {scheduleId} = req.params
    try {
        await Schedule.findByIdAndUpdate(scheduleId, {
            status
        })
        res.status(200).json()
    } catch (error) {
        next(error)
    }
}

//[DELETE] /api/schedules/:deviceId/:scheduleId
export const deleteSchedule = async (req, res, next) => {
    const {deviceId, scheduleId} = req.params
    try {
        await Schedule.findByIdAndRemove(scheduleId)
        res.status(200).json(await Schedule.find({ deviceId }).sort({ timeSchedule: 1 }))
    } catch (error) {
        next(error)
    }
}
