import mongoose from 'mongoose';
import Song from './Song';

const SetListType = Object.freeze({
    Unplugged: 'unplugged',
    Hybrid: 'hybrid',
    Electric: 'electric'
});

let EventSchema = new mongoose.Schema({
    eventId: mongoose.Schema.Types.ObjectId,
    bandId: mongoose.Schema.Types.ObjectId,
    eventDate: String,
    place: String,
    description: String,
    setList: [Song]
});

export default mongoose.model("Event", EventSchema);