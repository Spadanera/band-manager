import { Interface, type } from 'implement-js';

const Service = Interface('Service')({
    invitationService: type('object'),
    ogpService: type('object'),
}, {
    error: true,
    strict: true 
});

export default Service;