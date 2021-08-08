"use strict";

const router = require('express').Router();
import Band from '../../models/Band';
import BandMember from '../../models/BandMember';
import User from '../../models/User';

router.get("/", async (req, res) => {
    try {
        res.json(await Band.find({ bandMember: { "$in": req.session.userId } }));
    }
    catch (e) {
        console.error(e);
        res.status(500).json(e);
    }
});

router.get("/:id", async (req, res) => {
    try {
        res.json(await Band.findOne({ _id: req.params.id }));
    }
    catch (e) {
        console.error(e);
        res.status(500).json(e);
    }
});

router.post("/", async (req, res) => {
    try {
        let band = new Band(req.body);
        let user = await User.findOne({ _id: req.session.userId });
        let bandMember = new BandMember({
            userId: req.session.userId,
            userDisplayName: user.userDisplayName,
            userPicture: user.userPicture,
            bandId: band._id,
            role: "",
            isAdmin: true
        });
        await bandMember.save();
        band.bandMember.push(bandMember._id);
        res.json(await band.save());
    }
    catch (e) {
        console.error(e);
        res.status(500).json(e);
    }
});

router.put("/:id", async (req, res) => {
    try {
        let bandMember = await BandMember({ userId: req.session.userId, bandId: req.params.id, isAdmin: true });
        if (bandMember && req.parmas.id === req.body._id) {
            res.json(await Band.findOneAndUpdate({ _id: req.params.id }, req.body));
        }
        else {
            res.status(401).send("Unauthorized");
        }
    }
    catch (e) {
        console.error(e);
        res.status(500).json(e);
    }
});

export default router;