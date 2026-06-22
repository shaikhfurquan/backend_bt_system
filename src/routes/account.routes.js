const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const accountCtrl = require("../controllers/account.controller")

const accountRoutes = express.Router()

// POST - create new account 
accountRoutes.post('/create', authMiddleware.authMiddleware, accountCtrl.createAccountCtrl)

// GET - get all account of the logged-in user
accountRoutes.get('/user-account', authMiddleware.authMiddleware, accountCtrl.getUserAccountsCtrl)

// GET - get all account balance
accountRoutes.get('/balance/:accountId', authMiddleware.authMiddleware, accountCtrl.getAccountBalanceCtrl)


module.exports = accountRoutes