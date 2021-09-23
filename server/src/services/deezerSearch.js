import { create } from 'axios';
import { getLyrics, getSong } from 'genius-lyrics-api';
import deezerAuth from '../deezerAuth';

const client = create({});
const baseEndpoint = "https://api.deezer.com";

module.exports.search = async (text, type) => {
    let searchResults = (await client.get(
        `${baseEndpoint}/search?access_token=${deezerAuth.access_token}&q=${text}`
    )).data.data;

    return searchResults.filter(r => r.type === type);
};

module.exports.track = async (trackId) => {
    let track = (await client.get(
        `${baseEndpoint}/track/${trackId}?access_token=${deezerAuth.access_token}`
    )).data;

    return track;
};

module.exports.lyrics = async (title, artist) => {
    const options = {
        apiKey: 'JINAqXkHcP_hioSKXPVHM-N76klE48uJ8bdQucD8RCtus_MAFKl8g-ED4YG4k9xR',
        title: title,
        artist: artist,
        optimizeQuery: true
    };

    return await getLyrics(options);
};