import multer from "multer";

const storage =multer.diskStorage({
    destination:function (req,file,cb){
        cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
      
      cb(null, file.originalname)//and give the original path with poriginal name
    }
})

export const upload=multer({
   storage
})