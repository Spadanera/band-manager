"use strict";

const router = require('express').Router();
import User from '../../models/User';

// Get userinfo
router.get("/", async (req, res) => {
    try {
        res.json(await User.findOne({ _id: req.session.userId }));
    }
    catch (e) {
        console.error(e);
        res.status(500).json(e);
    }
});

router.get("/all", async (req, res) => {
    try {
        res.json(await User.find());
    }
    catch (e) {
        console.error(e);
        res.status(500).json(e);
    }
});

export default router;