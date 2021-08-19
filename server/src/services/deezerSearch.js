import { create } from 'axios';
import deezerAuth from '../deezerAuth';

const client = create({});
const baseEndpoint = "https://api.deezer.com";

module.exports.search = async (text, type) => {
    let searchResults = (await client.get(
        `${baseEndpoint}/search?access_token=${deezerAuth.access_token}&q=${text}`
    )).data.data;

    return searchResults.filter(r => r.type === type);
};