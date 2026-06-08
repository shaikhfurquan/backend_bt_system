const UserModel = require("../model/user.model")
const jwt = require("jsonwebtoken")


const authMiddleware = async (req, res, next) => {

     const token = req.cookies.token || req.headers.authorization?.split(" ")[ 1 ]

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized access, token is missing"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const user = await UserModel.findById(decoded.userId)
        if (!user) {
            return res.status(401).json({ message: "User not found" })
        }
        req.user = user
        return next()

    } catch (error) {
        return res.status(401).json({
            message: "Un-authorized access, token is invalid"
        })
    }
}

module.exports = {
    authMiddleware
}