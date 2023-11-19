import mongoose from 'mongoose';

const userSchema=new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique:true,
    },
    email:{
        type: String,
        required: true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    avatar:{
        type:String,
        default:"https://gachax.com/anime/wp-content/uploads/sites/29/2023/06/cute-anime-girl-pfp-profile-pictures-chibi.png",
        
    },
},{timestamps:true});

const User=mongoose.model('User',userSchema);

export default User;
