require("dotenv").config()

const express=require('express')
const cors=require('cors')
const path=require('path')
const connectDB = require("./config/db")
const authRoutes=require('./routes/authRoutes')
const sessionRoutes=require('./routes/sessionRoutes')

const app=express()


app.use(
    cors({
        origin:'*',
        methods:['GET','POST','PUT','DELETE'],
        allowedHeaders:['Content-Type','Authorization']
    })
)

app.use(express.json())

//Routes

app.use('/api/auth',authRoutes);
app.use('/api/sessions',sessionRoutes)
// app.use('/api/questions',questionRoutes)

// app.use('/api/ai/generate-questions', protect, generateInterviewQuestions)
// app.use('/api/ai/generate-explaination', protect, generateConceptExplaination)



// app.use("/uploads",express.static(path.join(__dirname,"uploads"),{}))


const port=process.env.PORT || 5000

app.listen(port,()=>{
    connectDB()
    console.log("server running on port " + port)
})