import mongoose from 'mongoose';
import Song from './Song';
import Image from './Image';

let BandSchema = new mongoose.Schema({
    bandId: mongoose.Schema.Types.ObjectId,
    creatorUserId: mongoose.Schema.Types.ObjectId,
    name: String,
    description: String,
    logo: String,
    location: String,
    setList: [Song],
    bandMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BandMember' }],
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
    genres: [String],
    isPublic: Boolean,
    isMembersPublic: Boolean,
    isSetlistPublic: Boolean,
    isEventsPublic: Boolean
});

export default mongoose.model("Band", BandSchema);