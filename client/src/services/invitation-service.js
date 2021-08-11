import client from './client';

const invitation = {
    getInvitations: async (bandId) => {
        let response = await client.get(
            `/api/invitations/all/${bandId}`
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

export default invitation;