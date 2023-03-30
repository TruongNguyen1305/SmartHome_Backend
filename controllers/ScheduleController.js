import Schedule from "../models/Schedule.js";
import scheduler from 'node-schedule'
import Device from "../models/Device.js";
import DeviceLog from "../models/DeviceLog.js";
import { mqttClient, AIO_USERNAME } from "../config/mqttClient.js";

const typeDevice = {
    light: "led",
    fan: "bbc-fan",
    door: "bbc-door"
}

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
    const { action } = req.body
    let {timeSchedule} = req.body
    const {deviceId} = req.params
    timeSchedule = new Date(timeSchedule)
    try {
        const schedules = await Schedule.find({ deviceId, timeSchedule: { $gte: new Date() } })
        schedules.map(schedule => {
            if (schedule.timeSchedule.toString() === timeSchedule.toString()) {
                throw new Error('Schedule is duplicated')
            }
        })

        const newSchedule = new Schedule({ deviceId, creator: req.user._id, action, timeSchedule })
        await newSchedule.save()

        //Len lich cho job
        scheduler.scheduleJob(newSchedule._id.valueOf(), newSchedule.timeSchedule, async ()=>{
            const device = await Device.findById(deviceId)
            const feedId = typeDevice[device.type]
            const data = newSchedule.action ? 1 : 0

            mqttClient.publish(`${AIO_USERNAME}/feeds/${feedId}`, JSON.stringify(data), { qos: 1 }, (err) => {
                if (err) {
                    console.error(`Failed to publish data to feed "${feedId}": ${err}`);
                } else {
                    console.log(`Published data to feed "${feedId}": ${JSON.stringify(data)}`);
                }
            });

            DeviceLog.create({
                deviceID: deviceId,
                value: data
            })
            console.log('Xong lịch r nhé !')
        })

        res.status(201).json(await Schedule.find({ deviceId, timeSchedule: { $gte: new Date() } }).sort({ timeSchedule: 1 }))
    } catch (error) {
        next(error)
    }
}

//[PATCH] /api/schedules/:deviceId/:scheduleId
export const editSchedule = async (req, res, next) => {
    const { action } = req.body
    let { timeSchedule } = req.body
    const { deviceId, scheduleId } = req.params
    const job = scheduler.scheduledJobs[scheduleId]
    timeSchedule = new Date(timeSchedule)
    try {
        const schedules = await Schedule.find({ deviceId, timeSchedule: { $gte: new Date() }  })
        schedules.map(schedule => {
            if (schedule.timeSchedule.toString() === timeSchedule.toString() && schedule._id.valueOf() !== scheduleId) {
                throw new Error('Schedule is duplicated')
            }
        })

        const editedSchedule = await Schedule.findByIdAndUpdate(scheduleId, {
            creator: req.user._id, 
            action, 
            timeSchedule
        }, {
            new: true
        })

        if (editedSchedule.status){
            job.cancel()
            scheduler.scheduleJob(editedSchedule._id.valueOf(), editedSchedule.timeSchedule, async () => {
                const device = await Device.findById(deviceId)
                const feedId = typeDevice[device.type]
                const data = editedSchedule.action ? 1 : 0
                mqttClient.publish(`${AIO_USERNAME}/feeds/${feedId}`, JSON.stringify(data), { qos: 1 }, (err) => {
                    if (err) {
                        console.error(`Failed to publish data to feed "${feedId}": ${err}`);
                    } else {
                        console.log(`Published data to feed "${feedId}": ${JSON.stringify(data)}`);
                    }
                });

                DeviceLog.create({
                    deviceID: deviceId,
                    value: data
                })

                console.log('Xong lịch r nhé !')
            })
        }

        res.status(200).json(await Schedule.find({ deviceId, timeSchedule: { $gte: new Date() } }).sort({ timeSchedule: 1}))
    } catch (error) {
        next(error)
    }
}

//[PATCH] /api/schedules/:deviceId/:scheduleId/toggle
export const toggleSchedule = async (req, res, next) => {
    const { status } = req.body
    const { scheduleId, deviceId } = req.params
    const job = scheduler.scheduledJobs[scheduleId]
    try {
        const toggledSchedule = await Schedule.findByIdAndUpdate(scheduleId, {
            status
        }, {
            new: true
        })

        if(status){
            scheduler.scheduleJob(toggledSchedule._id.valueOf(), toggledSchedule.timeSchedule, async () => {
                const device = await Device.findById(deviceId)
                const feedId = typeDevice[device.type]
                const data = toggledSchedule.action ? 1 : 0

                mqttClient.publish(`${AIO_USERNAME}/feeds/${feedId}`, JSON.stringify(data), { qos: 1 }, (err) => {
                    if (err) {
                        console.error(`Failed to publish data to feed "${feedId}": ${err}`);
                    } else {
                        console.log(`Published data to feed "${feedId}": ${JSON.stringify(data)}`);
                    }
                });

                DeviceLog.create({
                    deviceID: deviceId,
                    value: data
                })

                console.log('Xong lịch r nhé !')
            })
        }
        else
            job.cancel()
    
        res.status(200).json()
    } catch (error) {
        next(error)
    }
}

//[DELETE] /api/schedules/:deviceId/:scheduleId
export const deleteSchedule = async (req, res, next) => {
    const {deviceId, scheduleId} = req.params
    const job = scheduler.scheduledJobs[scheduleId]
    try {
        await Schedule.findByIdAndRemove(scheduleId)

        if(job)
            job.cancel()
        
        res.status(200).json(await Schedule.find({ deviceId, timeSchedule: { $gte: new Date() } }).sort({ timeSchedule: 1 }))
    } catch (error) {
        next(error)
    }
}
