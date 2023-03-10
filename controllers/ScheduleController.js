import Schedule from "../models/Schedule.js";

//[GET] /api/schedules/:deviceId
export const getAllSchedule = async (req, res, next) => {

}


//[POST] /api/schedules/:deviceId
export const createSchedule = async (req, res, next) => {
    const { status, timeSchedule } = req.body
    const {deviceId} = req.params
    try {
        const schedules = await Schedule.find({ deviceId })
        schedules.map(schedule => {
            if (schedule.timeSchedule.toString() === timeSchedule.toString()) {
                throw new Error(`Schedule is duplicated`)
            }
        })

        const newSchedule = new Schedule({ deviceId, creator: req.user._id, status, timeSchedule })
        await newSchedule.save()
        res.status(201).json(await Schedule.find({ deviceId }).sort({ timeSchedule: 1 }))
    } catch (error) {
        next(error)
    }
}

//[PATCH] /api/schedules/:deviceId/:scheduleId
export const editSchedule = async (req, res, next) => {
    const { status, timeSchedule } = req.body
    const { deviceId, scheduleId } = req.params
    try {
        const schedules = await Schedule.find({ deviceId })
        schedules.map(schedule => {
            if (schedule.timeSchedule.toString() === timeSchedule.toString() && schedule._id !== scheduleId) {
                throw new Error(`Schedule is duplicated`)
            }
        })

        await new Schedule.findByIdAndUpdate(scheduleId, {
            creator: req.user._id, 
            status, 
            timeSchedule
        })
        res.status(200).json(await Schedule.find({ deviceId }).sort({ timeSchedule: 1}))
    } catch (error) {
        next(error)
    }
}

//[PATCH] /api/schedules/:deviceId/:scheduleId
export const deleteSchedule = async (req, res, next) => {

}
