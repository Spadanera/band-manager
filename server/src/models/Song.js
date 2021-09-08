const SongStatuses = Object.freeze({
    Confirmed: 'confirmed',
    Pending: 'pending',
    Removed: 'removed'
});

const Song = {
    title: String,
    author: String,
    duration: { type: Number, default: 0 },
    status: { type: String, enum: Object.values(SongStatuses), default: SongStatuses.Confirmed },
    live: Boolean,
    position: { type: Number, default: 1 },
    audio: String,
    preview: String,
    cover: Boolean
};

export default Song;