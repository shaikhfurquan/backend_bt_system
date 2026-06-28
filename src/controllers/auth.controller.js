const UserModel = require("../model/user.model")
const jwt = require("jsonwebtoken")
const emailService = require('../services/email.service')
const TokenBlackListModel = require('../model/blackList.model')

const userRegisterCtrl = async (req, res, next) => {
    try {
        const { name, email, password } = req.body
        const isEmailExists = await UserModel.findOne({ email })
        if (isEmailExists) {
            return res.status(422).json({
                message: "User already exists with this email",
                status: "Failed"
            })
        }

        const user = await UserModel.create({
            name,
            email,
            password
        })

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRATION })

        res.cookie("token", token)
        res.status(201).json({
            user: {
                _id: user._id,
                email: user.email,
                name: user.name
            },
            token
        })
        emailService.sendRegistrationEmail(user.email, user.name)
            .then(() => {
                console.log("send mail");
            })
            .catch(console.error);
    }
    catch (error) {
        next(error)
    }
}


const userLoginCtrl = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const user = await UserModel.findOne({ email }).select("+password")
        if (!user) {
            return res.status(401).json({
                message: "Email or Password Invalid"
            })
        }

        const isValidPassword = await user.comparePassword(password)
        if (!isValidPassword) {
            return res.status(401).json({
                message: "Email or Password Invalid"
            })
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRATION })

        res.cookie("token", token)
        res.status(201).json({
            user: {
                _id: user._id,
                email: user.email,
                name: user.name
            },
            token
        })

    } catch (error) {
        next(error)
    }
}


const userLogoutCtrl = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.splits(" ")[1]
    if (!token) {
        return res.status(200).json({
            message: "User logged out successfully"
        })
    }

    res.cookie("token", "")
    await TokenBlackListModel.create({
        token: token
    })

    res.status(200).json({
        message: "User logged out successfully"
    })
}
module.exports = {
    userRegisterCtrl,
    userLoginCtrl,
    userLogoutCtrl
}