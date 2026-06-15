const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const transactionCtrl = require("../controllers/transaction.controller")

const transactionRoutes = express.Router()

transactionRoutes.post('/create', authMiddleware.authMiddleware, transactionCtrl.createTransaction)


module.exports = transactionRoutes