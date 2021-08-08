import client from '../client';
import IOgp from '../interfaces/IOgp';
import implement from 'implement-js';

const ogp = {
    getSetList: async () => {
        let response = await client.get(
            `/api/ogp/setlist`
        );
        return response.data;
    },
    updateSetList: async (setList) => {
        await client.put(`/api/ogp/setlist/${setList._id}`, setList);
    },
    getEvents: async () => {
        let response = await client.get(
            `/api/ogp/event`
        );
        return response.data;
    },
    getEvent: async (eventId) => {
        let response = await client.get(
            `/api/ogp/event/${eventId}`
        );
        return response.data;
    },
    createEvent: async (event) => {
        await client.post(`/api/ogp/event`, event);
    },
    updateEvent: async (event) => {
        await client.put(`/api/ogp/event`, event);
    },
    deleteEvent: async (eventId) => {
        await client.delete(`/api/ogp/event/${eventId}`);
    },
};

implement(IOgp)(ogp);

export default ogp;