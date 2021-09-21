import mongoose from 'mongoose';

const BandType = Object.freeze({
    Cover: 'cover',
    Tribute: 'tribute',
    Original: 'original',
});

const Link = {
    title: String,
    url: String
};

let BandSchema = new mongoose.Schema({
    creatorUserId: mongoose.Schema.Types.ObjectId,
    name: String,
    description: String,
    logo: String,
    location: String,
    setlists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Setlist' }],
    bandMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BandMember' }],
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
    type: { type: String, enum: Object.values(BandType), default: BandType.Cover },
    tributeArtist: String,
    genres: [String],
    links: [Link],
    isPublic: Boolean,
    isMembersPublic: Boolean,
    isSetlistPublic: Boolean,
    newSchema: Boolean,
});

export default mongoose.model("Band", BandSchema);