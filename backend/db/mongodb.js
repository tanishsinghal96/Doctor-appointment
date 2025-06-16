import mongoose from "mongoose";
import {DB_NAME} from "../constants.js"

const connectDb=async()=>{
    try {
        mongoose.connection.on('connected',()=>{
            console.log("database connected")
        })

        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n mongodb connected !! db host:${connectionInstance.connection.host}`)//reason fo this console is given below
    } catch (error) {
        console.log("mongodb error:",err)
    process.exit(1)//process is given for each file 
    }
}
export default connectDb;