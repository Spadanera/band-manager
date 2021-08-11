import mongoose from 'mongoose';

let BandMemberSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    userDisplayName: String,
    userPicture: String,
    userEmailAddress: String,
    bandId: mongoose.Schema.Types.ObjectId,
    role: String,
    createdAt: { type: Date, default: Date.now },
    isAdmin: Boolean,
    isCreator: Boolean,
    canEditMembers: Boolean,
    canEditInfo: Boolean,
    canEditSetList: Boolean,
    canEditEvents: Boolean
});

export default mongoose.model("BandMember", BandMemberSchema);