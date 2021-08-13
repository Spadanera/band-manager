"use strict";

const router = require('express').Router();
import Band from '../../models/Band';
import Event from '../../models/Event';
import BandMember from '../../models/BandMember';

router.get("/", async (req, res) => {
    res.json(await Event.find({ isPublic: true }));
});

router.get("/:bandId/:id", async (req, res) => {
    try {
        let band = await getBand(req.params.bandId, req.session.userId);
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
        let band = await getBand(req.params.bandId, req.session.userId);
        if (band) {
            let event = new Event(req.body);
            await event.save();
            band.events = band.events || [];
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
        res.status(500).json({ e: e.message });
    }
});

router.put("/:bandId/:id", async (req, res) => {
    try {
        let band = await getBand(req.params.bandId, req.session.userId);
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
        let band = await getBand(req.params.bandId, req.session.userId);
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
        res.status(500).json({ e: e.message });
    }
});

async function getBand(bandId, userId) {
    let bandMembers = await BandMember.find({ userId: userId }).select("_id");
    let band = await Band.findOne({ _id: bandId, bandMembers: { "$in": bandMembers } });
    return band;
}

export default router;