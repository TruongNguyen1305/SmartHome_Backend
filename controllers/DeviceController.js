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
    const filter = { _id: req.body.id };
    const update = {
        onValue: req.body.onValue,
        offValue: req.body.offValue
    };
   
    let device = await Device.findOneAndUpdate(filter, update);
    device = await Device.findOne(filter);
    console.log(device)
    res.status(200).json(device)
}

export const toggleAutomaticMode = async (req, res, next) => {
    const filter = { _id: req.body.id };
    const update = { auto: req.body.value };

    let device = await Device.findOneAndUpdate(filter, update);
    device = await Device.findOne(filter);
    res.status(200).json(device)
}