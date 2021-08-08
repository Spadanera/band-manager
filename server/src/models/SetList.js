import mongoose from 'mongoose';
import Song from './Song';

let SetList = new mongoose.Schema({
    setListId: mongoose.Schema.Types.ObjectId,
    setList: [Song]
});

export default mongoose.model("SetList", SetList);