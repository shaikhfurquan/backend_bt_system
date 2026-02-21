const express = require('express')
const authRouter = require("../src/routes/auth.routes")
const cors = require("cors")
const morgan = require("morgan")



const app = express()

// Middlewares
app.use(express.json())
app.use(cors())
app.use(morgan('dev'))


//Routes
app.get('/test' , (req,res)=>{
    res.status(200).json({test : "Test"});
})
app.use("/api/auth", authRouter)

module.exports = app