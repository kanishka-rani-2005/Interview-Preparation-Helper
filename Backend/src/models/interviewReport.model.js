const mongoose=require("mongoose")

/**
 * -job decription:String
 * reesume text:String
 * self description:String
 * --Match Score :Number
 */
/**
 * Technical question
 * [{
 * question:"",
 * intention:"",
 * answer:""
 * }]
 * Behavioral Questions
 *  [{
 * question:"",
 * intention:"",
 * answer:""
 * }]
 * Skill gaps:[{
 * skill:"",
 * severity:{
 * type:String,
 * enum:["low","medium","high"]
 * }
 * }]
 * Preparation plan:[{
 *      day:Number,
 *      focus:String,
 *      tasks:[String]
 * }]
 */

const technicalQuestionSchema=new mongoose.Schema(
    {
        question:{
            type:String,
            required:[true,'Techinal Question is Required']
        },
        intention:{
            type:String,
            required:[true,'Intention is Required']
        },
        answer:{
            type:String,
            required:[true,'Answer is Required']
        }
    },{
        _id:false
    }
)

const behavioralQuestionSchema=new mongoose.Schema(
    {
        question:{
            type:String,
            required:[true,'Behavioral Question is Required']
        },
        intention:{
            type:String,
            required:[true,'Intention is Required']
        },
        answer:{
            type:String,
            required:[true,'Answer is Required']
        }
    },{
        _id:false
    }
)

const skillGapsSchema=new mongoose.Schema(
    {
        skill:{
            type:String,
            required:[true,'Skill is Required']
        },
        severity:{
            type:String,
            required:[true,'Severity is Required'],
            enum:['low','medium','high']
        }
    },{
        _id:false
    }
)

const preparationPlanSchema=new mongoose.Schema(
    {
        day:{
            type:Number,
            required:[true,'Day is Required']
        },
        focus:{
            type:String,
            required:[true,'Focus is Required'],
        },
        tasks:[{
            type:String,
            required:[true,'Tasks is Required'],
        }]
    },{
        _id:false
    }
)

const interviewReportSchema=new mongoose.Schema({
    jobDescription:{
        type:String,
        required:[true,'Job Description is Required']
    },
    resumeText:{
        type:String,

    },
    selfDescription:{
        type:String
    },
    matchScore:{
        type:Number,
        min:0,
        max:100
    },
    technicalQuestions:[technicalQuestionSchema],
    behavioralQuestions:[behavioralQuestionSchema],
    skillGaps:[skillGapsSchema],
    preparationPlan:[preparationPlanSchema],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    }
},{
    timestamps:true
})


module.exports=mongoose.model("interviewReportModel",interviewReportSchema)