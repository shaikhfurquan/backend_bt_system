const UserModel = require("../model/user.model")
const AccountModel = require("../model/account.model")
const emailService = require('../services/email.service')


const createAccountCtrl = async (req, res, next) => {
    try {
        const user = req.user
        const account = await AccountModel.create({
            user: user._id
        })
        res.status(201).json({
            account
        })
    } catch (error) {
        next(error)
    }
}



module.exports = {
    createAccountCtrl
}