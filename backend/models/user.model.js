import mongoose,{Schema,model} from "mongoose";
import bcrypt from "bcrypt";

const userSchema=new Schema({
     name:{
        type:String,
        required:true
     },
     email:{
        type:String,
        required:true,
        unique:true,
        index:true
     },
     password:{
        type:String,
        required:true
     },
     image:{
      type:String,
      default:"http://res.cloudinary.com/dsl5cvnwj/image/upload/v1750428723/i8kc6floypq5bwsded1e.jpg"
     },

     address:{
        type:Object,
        default:{
            line1:"",
            line2:""
        }
     },
     gender:{
        type:String,
        default:"not Selected"
     },
     dob:{
        type:String,
        default:"not selected"
     },
     phone:{
        type:String,
        default:"0000000000"
     }

    
},{minimize:false,timestamps:true});

userSchema.pre("save",async function(next){
   if(!this.isModified("password")) return next();
   this.password=await bcrypt.hash(this.password,10);
   next();
})

userSchema.methods.comparePassword=async function(password){
    return await bcrypt.compare(password,this.password);
}


//Pluralization only affects the MongoDB collection name, not the key inside mongoose.models.
const userModel=mongoose.models.user ||model("User",userSchema);
//whenever this is executed then modle created multiple times so we use the || 
export default userModel;