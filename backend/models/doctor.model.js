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
     },
     rating:{
      type:Number,
      default:0
     }
},{minimize:false, timestamps:true, toJSON: { virtuals: true }, toObject: { virtuals: true }});

doctorSchema.virtual("reviews",{
      ref:"Review", //the model name
      localField:"_id", //the field in the doctor model
      foreignField:"doctor", //the field in the review model
      //count:true //to get the count of reviews
})


//it is wrong beacusr we are using the this inside the arrow function so use the normal function
doctorSchema.pre("save",async function (next){
   if(!this.isModified("password")) next();
   this.password=await bcrypt.hash(this.password,10);//10 rounds it genrate the ecret key to hashed the password
   next();
})
//for compare the password is it correct or not 
doctorSchema.methods.ispasswordCorrect=async function(password) {
   //console.log("password",this.password);
   return await bcrypt.compare(password,this.password);
} 
const doctorModel=mongoose.models.doctor || model("Doctor",doctorSchema);
//Pluralization only affects the MongoDB collection name, not the key inside mongoose.models.
export default doctorModel
//whenever this is executed then modle created multiple times so we use the || 