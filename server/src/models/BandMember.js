import mongoose, { mongo } from 'mongoose';

let BandMemberSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    userDisplayName: String,
    userPicture: String,
    bandId: mongoose.Schema.Types.ObjectId,
    createdAt: { type: Date, default: Date.now },
    active: Boolean
});

export default mongoose.model("BandMember", BandMemberSchema);