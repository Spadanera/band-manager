import mongoose from 'mongoose';

let InvitationSchema = new mongoose.Schema({
    inviterId: mongoose.Schema.Types.ObjectId,
    bandId: mongoose.Schema.Types.ObjectId,
    emailAddress: String,
    token: String
});

export default mongoose.model("Invitation", InvitationSchema);