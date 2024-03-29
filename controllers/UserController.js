import User from "../models/User.js";
import Home from "../models/Home.js";
import FaceID from "../models/FaceID.js";

import generateToken from "../config/generateToken.js";



const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

// [GET] /api/users
export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({})
        res.status(200).json(users)
    } catch (error) {
        print(error.message)
        next(error)
    }
}

//[POST] /api/users
export const registerUser = async (req, res, next) => {
    const { name, email, password, homeID} = req.body
    console.log('TESTDATA', name, email, password, homeID)
    if (!name || !email || !password) {
        res.status(400)
        next(new Error('Bạn phải điền các thông tin cần thiết'))
    }

    if (!validateEmail(email)) {
        res.status(400)
        next(new Error('Email không hợp lệ'))
    }

    const userExist = await User.findOne({ email })

    if (userExist) {
        res.status(400)
        next(new Error('Email đã được sử dụng'))
    }

    try {
        Home.findOne({ _id: homeID })
            .then(async (home) => {
                const user = new User({ name, email, password, homeID: home._id })
                await user.save()
                res.status(201).json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    homeID: user.homeID,
                    token: generateToken(user._id)
                })
            })
            .catch((error) => next(new Error('Home Key invalid')))
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}

//[POST] /api/users/login
export const authUser = async (req, res, next) => {
    const { email, password } = req.body
    console.log(email, password)
    if (!email || !password) {
        res.status(400)
        next(new Error('Bạn phải điền các thông tin cần thiết'))
    }
    try {
        const user = await User.findOne({ email })
        console.log(user)
        if (user && (await user.matchPassword(password))) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                pinCode: user.pinCode,
                homeID: user.homeID,
                token: generateToken(user._id),
            })
        }
        else {
            res.status(401)
            next(new Error('Invalid email or password !'))
        }
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}

//[PUT] /api/users/setpin
export const setPin = async (req, res, next) => {
    const { _id, pinCode } = req.body
    User.findOneAndUpdate({_id: _id}, {pinCode: pinCode}, {new: true})
    .then(updatedUser => {
        console.log(updatedUser); // Log ra user đã được update
        res.status(201).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            pinCode: updatedUser.pinCode,
            home: updatedUser.homeID,
            token: generateToken(updatedUser._id)
        })
    })
    .catch(error => {
        res.status(401)
        next(new Error('Error'))
    });
}

//[POST] /api/users/addface
export const addFace = async (req, res, next) => {
    const {userID, name, images} = req.body

    FaceID.create({ userID, name, images })
        .then((image) =>    
            res.status(201).json({
                userID: image.userID,
                name: image.name,
                images: image.images,
            })
        )
        .catch(next)
}

//[POST]/api/users/deleteface
export const deleteFace = async (req, res, next) => {
    const { face_id, user_id } = req.body
    if (!face_id) {
        res.status(400)
        next(new Error('Bạn phải điền các thông tin cần thiết'))
    }
    
    FaceID.deleteOne({_id: face_id})
        .then((e) => {
            FaceID.find({userID: user_id})
            .then(face => 
                {
                    res.status(201).json(face)    
                }
            )
            .catch(next)
        })
        .catch(next)
}

// [GET]/api/users/getface
export const getFace = (req, res, next) => {
    const userID = req.params.id
    console.log(userID)
    FaceID.find({userID})
        .then(face => 
            {
                res.status(201).json(face)    
            }
        )
        .catch(next)
}


