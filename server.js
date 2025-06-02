require("dotenv").config()

const express=require('express')
const cors=require('cors')
const path=require('path')
const connectDB = require("./config/db")

const app=express()


app.use(
    cors({
        origin:'*',
        methods:['GET','POST','PUT','DELETE'],
        allowedHeaders:['Content-Type','Authorization']
    })
)

app.use(express.json())

app.use("/uploads",express.static(path.join(__dirname,"uploads"),{}))


const port=process.env.PORT || 5000

app.listen(()=>{
    connectDB()
    console.log("server running on port " + port)
})