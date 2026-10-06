import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    title:{
        type:String,
        required:true,
        trim:true,
    },
    description:{
        type:String,
        trim:true,
    },
    priority:{
        type:String,
        enum:["high","medium","low"],
        default:"medium",
    },
   status:{
    type:String,
    enum:["pending","completed"],
    default:"pending"
   },
   dueDate:{
    type:Date,
    required:true,
   }
},
{timestamps:true});
const Task = mongoose.model("Task",taskSchema);
export default Task;