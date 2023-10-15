import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    userid: { type: String, unique: true },
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
})

export const Usermodel = mongoose.model('User', UserSchema)
