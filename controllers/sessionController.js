const Session=require("../models/Session")
const Question=require("../models/Question")


exports.createSession=async(req,res)=>{
    try {

        const {role,experience,topicsToFocus,description,questions}=req.body

        const userId=req.user._id

        const session=await Session.create({
            user:userId,
            role,
            experience,
            topicsToFocus,
            description
        })

        const questionsDocs=await Promise.all(
            questions.map(async(q)=>{
                const question=await Question.create({
                    session:session._id,
                    question:q.question,
                    answer:q.answer
                })
                return question._id
            })
        )

        session.questions=questionsDocs
        await session.save()

        res.status(201).json({
            success:true,
            session
        })

    } catch (err) {
        res.status(500).json({
            success:false,
            message:"Server Error"
        })
    }
}

exports.getMySessions=async(req,res)=>{
    try {
        const _id=req.user._id
        
        const sessions=await Session.find({user: _id})
        .sort({createdAt:-1})
        .populate("questions")

        res.status(200).json(sessions)

    } catch (err) {
        res.status(500).json({
            success:false,
            message:"Server Error",
            err:err.message
        })
    }
}

exports.getMySessionById=async(req,res)=>{
    try {
        const session=await Session.findById(req.params.id)
        .populate({
            path:"questions",
            options:{sort:{isPinned:-1,createdAt:1}}
        })
        .exec();

        if(!session) {
            return res.status(404).json({
                success:false,
                message:"session not found"
            })
        }
        res.status(200).json({sucess:true,session})
    } catch (err) {
        res.status(500).json({
            success:false,
            message:"Server Error"
        })
    }
}

exports.deleteSession=async(req,res)=>{
    try {
        const session=await Session.findById(req.params.id)
        if(!session) {
            return res.status(404).json({
                success:false,
                message:"session not found"
            })
        }

        if(session.user.toString() !== req.user.id) {
            return res.status(401).json({
                message:'Not authorized to delete'
            })
        }
await Question.deleteMany({session:session._id})
await session.deleteOne()

res.status(200).json({message:"Session deleted Sucessfully"})
    } catch (err) {
        res.status(500).json({
            success:false,
            message:"Server Error"
        })
    }
}