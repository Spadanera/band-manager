import client from './client';

const band = {
    getBands: async () => {
        let bands = (await client.get(
            `/api/band`
        )).data;
        for (let i = 0; i < bands.length; i++) {
            bands[i].memberInfo = (await client.get(
                `/api/band/memberinfo/${bands[i]._id}`
            )).data;
            if (bands[i].location) {
                bands[i].location_address = JSON.parse(bands[i].location);
            }
            else {
                bands[i].location_address = {};
            }
        }
        return bands;
    },
    memberInfo: async (id) => {
        let response = await client.get(
            `/api/band/memberinfo/${id}`
        );
        return response.data;
    },
    getBand: async (id) => {
        let response = await client.get(
            `/api/band/${id}`
        );
        return response.data;
    },
    upsertBand: async (band, element) => {
        let response;
        if (!band._id) {
            response = await client.post("/api/band", band);
        }
        else {
            response = await client.put(`/api/band/${band._id}/${element}`, band);
        }
        return response.data;
    },
    deleteBand: async (id) => {
        await client.delete(`/api/band/${id}`);
    },
    updateBandMember: async (bandId, bandMember) => {
        let response;
        response = await client.put(`/api/bandMember/${bandId}`, bandMember);
        return response.data;
    },
    deleteBandMember: async (bandMemberId) => {
        let response;
        response = await client.delete(`/api/bandMember/${bandMemberId}`);
        return response.data;
    },
    upsertEvent: async (bandId, event) => {
        if (event._id) {
            return (await client.put(`/api/event/${bandId}/${event._id}`, event)).data;
        }
        else {
            return (await client.post(`/api/event/${bandId}`, event)).data;
        }
    },
    deleteEvent: async (bandId, eventId) => {
        return (await client.delete(`/api/event/${bandId}/${eventId}`)).data;
    },
    searchSong: async (text) => {
        return (await client.get(`/api/deezer/songs?q=${text}`)).data;
    },
    getGmapsLink: (place) => {
        return `https://www.google.com/maps/search/?api=1&query_place_id=${place.place_id}&query=${encodeURIComponent(place.formatted_address)}`;
    }
};

export default band;