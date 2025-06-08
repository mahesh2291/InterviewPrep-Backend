const User=require('../models/User')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')

const generateToken=(userId)=>{
    return jwt.sign({id:userId},process.env.JWT_SECRET,{expiresIn:'1d'})
}

const registerUser=async(req,res)=>{
    try {
        const {name,email,password}=req.body

        const userExist=await User.findOne({email})
        if(userExist) {
            return res.status(400).json({message:"User already exist"})
        }

        const hashedPassword=await bcrypt.hash(password,10)

        const user=await User.create({
            name:name,
            email:email,
            password: hashedPassword
        })

        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            token:generateToken(user._id)
        })
    } catch (error) {
        res.status(500).json({message:"Server error",error:error.message})
    }

}


const loginUser=async(req,res)=>{

    try {
        const {email,password}=req.body
        const user=await User.findOne({email})
        if(!user) {
            return res.status(500).json({message:"No User Found"})
        }

        const isPasswordValid=bcrypt.compare(password,user.password)

        if(!isPasswordValid) {
            return res.status(500).json({message:'Invalid Email or Password'})
        }
        req.user=user
        return res.json({
            _id:user._id,
            name:user.name,
            email:user.email,
            token:generateToken(user._id)
        })

        

    } catch (error) {
        res.status(500).json({message:"Server error",error:error.message})
    }

    

   
}

const getUserProfile=async(req,res)=>{
    try {
        const user_id=req.user._id
        const user=await User.findById(user_id).select('-password')
        if(!user) {
            return res.status(404).json({message:"No User Found"})
        }

        res.send({
            user
        })

    } catch (error) {
        res.status(500).json({message:"Server error",error:error.message})
    }
}


module.exports={registerUser,loginUser,getUserProfile}