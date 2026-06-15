const express = require('express')
const cors = require("cors")
const morgan = require("morgan")
const cookieParser = require("cookie-parser")
// Routes
const authRoutes = require("./routes/auth.routes")
const accountRoutes = require("./routes/account.routes")
const transactionRoutes = require('./routes/transaction.routes')

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

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/account", accountRoutes)
app.use("/api/account", accountRoutes)
app.use("/api/transaction", transactionRoutes)


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