import DeviceLog from "../models/DeviceLog.js";


export const addDeviceLog = async(req, res, next) => {
    const {deviceID, creatorID, value} = req.body
    
    DeviceLog.create({deviceID, creatorID, value})
        .then((deviceLog) => res.status(201).json(deviceLog))
        .catch(next)
}