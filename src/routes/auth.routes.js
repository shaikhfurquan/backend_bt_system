const express = require("express")
const authController = require("../controllers/auth.controller")

const authRoutes = express.Router()

authRoutes.post("/register", authController.userRegisterCtrl)
authRoutes.post("/login", authController.userLoginCtrl)
authRoutes.post("/logout", authController.userLogoutCtrl)

module.exports = authRoutes