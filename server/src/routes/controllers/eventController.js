"use strict";

const router = require('express').Router();
import Band from '../../models/Band';
import Event from '../../models/Event';

router.get("/", async (req, res) => {
    res.json(await Event.find({ isPublic: true }));
});

router.get("/:bandId", async (req, res) => {
    try {
        let band = await Band.find({ _id: req.params.bandId, bandMember: { "$in": req.session.userId } }).populate("events bandMembers");
        if (band) {
            res.json(await Event.find());
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

router.get("/:bandId/:id", async (req, res) => {
    try {
        let band = await Band.find({ _id: req.params.bandId, bandMember: { "$in": req.session.userId } });
        if (band) {
            res.json(await Event.findOne({ _id: req.params.id }));
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

router.post("/:bandId", async (req, res) => {
    try {
        let band = await Band.find({ _id: req.params.bandId, bandMember: { "$in": req.session.userId } });
        if (band) {
            let event = new Event(req.body);
            await event.save();
            band.events.push(event._id);
            await band.save();
            res.json(event);
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

router.put("/:bandId/:id", async (req, res) => {
    try {
        let band = await Band.find({ _id: req.params.bandId, bandMember: { "$in": req.session.userId } });
        if (band) {
            res.json(await Event.findOneAndUpdate({
                _id: req.params.id
            }, req.body));
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

router.delete("/:bandId/:id", async (req, res) => {
    try {
        let band = await Band.find({ _id: req.params.bandId, bandMember: { "$in": req.session.userId } });
        if (band) {
            let event = await Event.findOne({ _id: req.params.id });
            await event.remove();
            band.events.splice(band.events.indexOf(event._id), 1);
            band.save();
            res.send("Deleted");
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