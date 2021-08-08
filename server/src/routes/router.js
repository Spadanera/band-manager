"use strict";

const router = require('express').Router();
import User from '../models/User';

router.use(async (req, res, next) => {
    if (req.url.startsWith("/invitations/chronicle/")) {
        next();
    }
    if (req.url.startsWith("/ogp")) {
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

router.use("/invitations", require("./controllers/invitationsController").default);
router.use("/ogp", require("./controllers/ogpController").default);

export default router;