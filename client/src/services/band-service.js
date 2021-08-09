import client from './client';

const band = {
    getBands: async () => {
        let response = await client.get(
            `/api/band`
        );
        return response.data;
    },
    getBand: async (id) => {
        let response = await client.get(
            `/api/band/${id}`
        );
        return response.data;
    },
    upsertBand: async (band) => {
        let response;
        if (!band._id) {
            response = await client.post("/api/band", band);
        }
        else {
            response = await client.put(`/api/band/${band._id}`, band);
        }
        return response;
    },
    deleteBand: async (id) => {
        await client.delete(`/api/band/${id}`);
    }
};

export default band;