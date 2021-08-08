import mongoose from 'mongoose';
import Song from './Song';

let BandSchema = new mongoose.Schema({
    bandId: mongoose.Schema.Types.ObjectId,
    name: String,
    description: String,
    logo: String,
    setList: [Song],
    bandMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BandMember' }],
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
    isPublic: Boolean,
    isMemberPublic: Boolean,
});

export default mongoose.model("Band", BandSchema);