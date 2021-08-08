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

router.get("/public", async (req, res) => {
    try {
        let bands = await Band.find({ isPublic: true }).populate("events");
        for (let i = 0; i < bands.length; i++) {
            let band = bands[i];
            band.events = band.events.filter(e => e.isPublic);
            for (let j = 0; j < band.events.length; j++) {
                if (band.events[j].isPublicSetList) {
                    await band.events[i].populate("setList");
                }
            }
            if (band.isMemberPublic) {
                await bands[i].populate("bandMembers");
            }
        }
        res.json(await Band.find({ isPublic: true }));
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