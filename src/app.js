const express = require('express')
const authRoutes = require("../src/routes/auth.routes")
const cors = require("cors")
const morgan = require("morgan")
const cookieParser = require("cookie-parser")

const app = express()


// Middlewares
app.use(express.json())
app.use(cors())
app.use(morgan('dev'))
app.use(cookieParser())


// Test Route
app.get('/test', (req, res) => {
    res.status(200).json({ test: "Test Route" });
})

// Auth Routes
app.use("/api/auth", authRoutes)


// Centralized Error Handler (Express Error Middleware)
// Centralized Error Handler
app.use((err, req, res, next) => {

    const match = err.stack.match(/\((.*):(\d+):(\d+)\)/)

    res.status(500).json({
        errorMessage: err.message,
        errorFile: match ? match[1] : null,
        errorLine: match ? match[2] : null
    })
})

module.exports = app