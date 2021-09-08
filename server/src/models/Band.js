import mongoose from 'mongoose';
import Song from './Song';

const BandType = Object.freeze({
    Cover: 'cover',
    Tribute: 'tribute',
    Original: 'original'
});

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
    type: { type: String, enum: Object.values(BandType), default: BandType.Cover },
    tributeArtist: String,
    genres: [String],
    isPublic: Boolean,
    isMembersPublic: Boolean,
    isSetlistPublic: Boolean,
});

export default mongoose.model("Band", BandSchema);