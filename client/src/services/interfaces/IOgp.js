import { Interface, type } from 'implement-js';

const Ogp = Interface('Session')({
    getSetList: type('function'),
    updateSetList: type('function'),
    getEvents: type('function'),
    getEvent: type('function'),
    createEvent: type('function'),
    updateEvent: type('function'),
    deleteEvent: type('function')
}, {
    error: true,
    strict: true 
});

export default Ogp;