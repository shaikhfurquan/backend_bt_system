const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const accountCtrl = require("../controllers/account.controller")

const accountRoutes = express.Router()

accountRoutes.post('/create', authMiddleware.authMiddleware, accountCtrl.createAccountCtrl)


module.exports = accountRoutes