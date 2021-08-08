import { Interface, type } from 'implement-js';

const Invitation = Interface('Invitation')({
    getInvitations: type('function'),
    createInvitation: type('function'),
    deleteInvitation: type('function')
}, {
    error: true,
    strict: true 
});

export default Invitation;