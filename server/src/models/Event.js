import mongoose from 'mongoose';
import Song from './Song';
import Image from './Image';

const SetlistType = Object.freeze({
    Unplugged: 'unplugged',
    Hybrid: 'hybrid',
    Electric: 'electric'
});

let EventSchema = new mongoose.Schema({
    bandId: mongoose.Schema.Types.ObjectId,
    eventDate: String,
    eventTime: String,
    locationName: String,
    locationAddress: String,
    description: String,
    locationURL: String,
    setlist: [Song],
    isPublic: Boolean,
    isSetlistPublic: Boolean,
    poster: Image,
});

export default mongoose.model("Event", EventSchema);