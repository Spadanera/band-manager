import mongoose from 'mongoose';
import Song from './Song';

let BandSchema = new mongoose.Schema({
    bandId: mongoose.Schema.Types.ObjectId,
    name: String,
    logo: String,
    setList: [Song]
});

export default mongoose.model("Band", BandSchema);