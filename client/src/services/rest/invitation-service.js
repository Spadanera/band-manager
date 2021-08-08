import client from '../client';
import IInvitation from '../interfaces/IInvitation';
import implement from 'implement-js';

const invitation = {
    getInvitations: async (chronicleId) => {
        let response = await client.get(
            `/api/invitations/all/${chronicleId}`
        );
        return response.data;
    },
    createInvitation: async (invitation) => {
        let response = await client.post("/api/invitations", invitation);
        return response;
    },
    deleteInvitation: async (id) => {
        await client.delete(`/api/invitations/${id}`);
    }
};

implement(IInvitation)(invitation);

export default invitation;