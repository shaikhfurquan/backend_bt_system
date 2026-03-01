const UserModel = require("../model/user.model")
const jwt = require("jsonwebtoken")

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
    }
    catch (error) {
        next(error)
    }
}


module.exports = {
    userRegisterCtrl
}