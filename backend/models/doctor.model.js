import mongoose,{Schema,model} from "mongoose"
import bcrypt from "bcrypt"
const doctorSchema=new Schema({
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
        type:String,//come from the cloudinary
        required:true
     },
     speciality:{
        type:String,
        required:true
     },
     degree:{
        type:String,
        required:true
     },
     experience:{
        type:String,
        required:true
     },
     about:{
        type:String,
        required:true
     },
     available:{
        type:Boolean,
        default:true
     },
     fees:{
        type:Number,
        required:true
     },
     address:{
        type:Object,
        required:true
     },
    //  date:{
    //     type:Number,
    //     required:true
    //  },
     slots_Booked:{
        type:Object,
        default:{}//for empty initialisation we have to define the minimize false
     }
},{minimize:false,timestamps:true});


//it is wrong beacusr we are using the this inside the arrow function so use the normal function
doctorSchema.pre("save",async function (password){
   if(!this.isModified(password)) next();
   this.password=await bcrypt.hash(this.password,10);//10 rounds it genrate the ecret key to hashed the password
   next();
})
//for compare the password is it correct or not 
doctorSchema.methods.ispasswordCorrect=async function(password) {
   return await bcrypt.compare(this.password,password);
} 
const doctorModel=mongoose.models.doctor || model("Doctor",doctorSchema);
//Pluralization only affects the MongoDB collection name, not the key inside mongoose.models.
export default doctorModel
//whenever this is executed then modle created multiple times so we use the || 