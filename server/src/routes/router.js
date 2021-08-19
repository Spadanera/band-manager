"use strict";

const router = require('express').Router();
import User from '../models/User';

router.use(async (req, res, next) => {
    if (req.url.startsWith("/invitations/band/") || req.url.startsWith("/deezer")) {
        next();
    }
    else {
        let user = await User.findOne({ _id: req.session.userId, token: req.session.token });
        if (user) {
            next();
        }
        else {
            req.session.userId = undefined;
            req.session.token = undefined;
            res.status(401).send("Unauthorized");
        }
    }
});

router.use("/user", require("./controllers/userController").default);
router.use("/invitations", require("./controllers/invitationsController").default);
router.use("/band", require("./controllers/bandController").default);
router.use("/bandMember", require("./controllers/bandMemberController").default);
router.use("/event", require("./controllers/eventController").default);
router.use("/deezer", require("./controllers/deezerController").default);

export default router;