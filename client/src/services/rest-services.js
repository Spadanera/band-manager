const service = {
    invitationService: require('./invitation-service').default,
    bandService: require('./band-service').default,
    publicService: require('./public-service').default
};

export default service;