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