import Device from "../models/Device.js";

export const addDevice = async (req, res, next) => {
    const { name, type, homeID } = req.body
    Device.create({name, type, homeID})
        .then((device) => res.status(201).json(device))
        .catch(next)
}

export const getAllDevice = async (req, res, next) => {
    Device.find({})
        .then((data) => res.status(200).json(data))
        .catch(next)
}

export const changeAutomaticValue = async (req, res, next) => {
    Device.findOneAndUpdate(
        { _id: req.body.id },
        {
            onValue: req.body.onValue,
            offValue: req.body.offValue
        }
    )
        .then((data) => {
            console.log(data)
            res.status(200).json(data)
        })
        .catch(error => {
            res.status(401)
            next(new Error('Error'))
        });
}

export const toggleAutomaticMode = async (req, res, next) => {
    Device.findOneAndUpdate( { _id: req.body.id },
        {
            auto: req.body.value
        }
    )
        .then((data) => {
            console.log(data)
            res.status(200).json(data)
        })
        .catch(error => {
            res.status(401)
            next(new Error('Error'))
        });
}