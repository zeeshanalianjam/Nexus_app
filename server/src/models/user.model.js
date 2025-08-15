import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['investor', 'entrepreneur', 'admin'],
        default: 'investor',
    },
    profilePicture: {
        type: String,
        default : "",
    },
    bio: {
        type: String,
        trim: true,
    },
    refreshToken : {
        type: String,   
        default: null,
        },

}, {
    timestamps: true,
})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({ _id: this._id, email: this.email ,role: this.role }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    });
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    });
}


export const User = mongoose.model('User', userSchema)