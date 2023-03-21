import DeviceLog from "../models/DeviceLog.js";
import Device from "../models/Device.js";
import User from "../models/User.js";

export const addDeviceLog = async(req, res, next) => {
    const {deviceID, creatorID, value} = req.body
    
    DeviceLog.create({deviceID, creatorID, value})
        .then((deviceLog) => res.status(201).json(deviceLog))
        .catch(next)
}

// [GET /api/devicelog/:id
export const getAllDeviceLogOfHome = async(req, res, next) => {
    const homeID  = req.params.id


    Device.find({homeID: homeID})
        .then((dataDevice) => {
            DeviceLog.find({deviceID: { $in: dataDevice}}).populate('creatorID', 'name').populate('deviceID', 'type')
                .then((data) => 
                        // console.log(addName(data))
                        res.status(201).json(data)
                    )
                })
                .catch(next)
        .catch(next)

}