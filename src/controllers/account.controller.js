const UserModel = require("../model/user.model")
const AccountModel = require("../model/account.model")
const emailService = require('../services/email.service')

// POST - create new account 
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

// GET - get all account of the logged-in user
const getUserAccountsCtrl = async (req, res, next) => {
    try {
        const accounts = await AccountModel.find({
            user: req.user._id
        })
        res.status(201).json({
            accounts
        })
    } catch (error) {
        next(error)
    }
}


// GET - get account balance
const getAccountBalanceCtrl = async (req, res, next) => {
    try {
        const { accountId } = req.params
        const account = await AccountModel.findOne({
            _id: accountId,
            user: req.user._id
        })
        if (!account) {
            res.status(404).json({
                message: "Account not found"
            })
        }
        const balance = await account.getBalance()
        res.status(201).json({
            accountId:accountId,
            balance
        })
    } catch (error) {
        next(error)
    }
}



module.exports = {
    createAccountCtrl,
    getUserAccountsCtrl,
    getAccountBalanceCtrl
}