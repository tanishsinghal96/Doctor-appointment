class ApiError extends Error{
    constructor(statusCode,message="something went wrong",errors=[],stack=""){
         super(message)
        this.statusCode=statusCode
        this.message=message
        this.success=false
        this.errors=errors
        this.data=null

        if(stack)
            this.stack=stack //tracking the error reason
        else{
            Error.captureStackTrace(this,this.constructor)
        }
    }

}


export {ApiError}