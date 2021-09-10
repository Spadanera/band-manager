import mongoose from 'mongoose';
import Song from './Song';

const SetlistSchema = new mongoose.Schema({
    title: String,
    bandId: mongoose.Schema.Types.ObjectId,
    songs: [Song]
});

export default mongoose.model("Setlist", SetlistSchema);