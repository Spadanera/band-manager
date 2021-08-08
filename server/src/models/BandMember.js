import mongoose, { mongo } from 'mongoose';

let BandMemberSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    userDisplayName: String,
    userPicture: String,
    bandId: mongoose.Schema.Types.ObjectId,
    role: String,
    createdAt: { type: Date, default: Date.now },
    isAdmin: Boolean
});

export default mongoose.model("BandMember", BandMemberSchema);