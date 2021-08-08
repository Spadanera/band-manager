import mongoose from 'mongoose';

let UserSchema = new mongoose.Schema({
    googleId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    token: String,
    displayName: String,
    giveName: String,
    familName: String,
    picture: String
});

export default mongoose.model("User", UserSchema);