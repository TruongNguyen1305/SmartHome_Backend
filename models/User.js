import mongoose from "mongoose";
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

const UserSchema = new mongoose.Schema({
    email: { type: String, trim: true, unique: true, required: true },
    password: { type: String, trim: true, require: true, minLength: 6 },
    name: { type: String, required: true, minLength: 5 },

    pinCode: String,
    homeID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Home',
        required: true,
    },
}, {
    timestamps: true
})

UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

UserSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next()

    const salt  = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)

    if (!this.key) {
        // generate a random key using Node.js crypto library
        this.key = crypto.randomBytes(16).toString('hex');
      }
      
})

const User = mongoose.model('User', UserSchema)
export default User