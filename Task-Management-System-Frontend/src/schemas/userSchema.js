export const UserSchema = {
    id:Number,
    email:String,
    role:String,
    created_at:String,
    updated_at:String
};

export const UserSignupSchema ={
    email:String,
    password:String,
    role:String 
};

export const UserLoginSchema = {
    email:String,
    password:String
}

export const LoginResponseSchema = {
    access_token: String,
    token_type:String,
    user:UserSchema
};