import User from "../models/User.js";
import generateToken from "../config/generateToken.js";

const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

// const validatePhone = (phone) => {
//     return phone.match(/(84|0[3|5|7|8|9])+([0-9]{8})\b/)
// }

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
    const { name, email, password} = req.body
    console.log(name, email, password)
    if (!name || !email || !password) {
        res.status(400)
        next(new Error('Bạn phải điền các thông tin cần thiết'))
    }

    if (!validateEmail(email)) {
        res.status(400)
        next(new Error('Email không hợp lệ'))
    }

    // if (!validatePhone(phoneNumber)) {
    //     res.status(400)
    //     next(new Error('Số điện thoại không hợp lệ'))
    // }

    const userExist = await User.findOne({ email })

    if (userExist) {
        res.status(400)
        next(new Error('Email đã được sử dụng'))
    }

    try {
        const user = new User({ name, email, password })
        await user.save()
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}

//[POST] /api/users/login
export const authUser = async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
        res.status(400)
        next(new Error('Bạn phải điền các thông tin cần thiết'))
    }

    try {
        const user = await User.findOne({ email })
        if (user && (await user.matchPassword(password))) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id)
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