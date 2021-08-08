import IService from "../interfaces/IService";
import implement from 'implement-js';

const service = {
    invitationService: require('./invitation-service').default,
    ogpService: require('./ogp-service').default,
};

implement(IService)(service);

export default service;