"use strict";

const router = require('express').Router();
import Band from '../../models/Band';
import BandMember from '../../models/BandMember';

router.put("/:id", async (req, res) => {
    try {
        let bandUserMembers = await BandMember.find({ userId: req.session.userId }).select("_id");
        let bandMember = req.body;
        let band = await Band.findOne({ _id: bandMember.bandId, bandMembers: { "$in": bandUserMembers } });
        if (bandMember.isAdmin) {
            bandMember.canEditMembers = true;
            bandMember.canEditInfo = true;
            bandMember.canEditSetList = true;
            bandMember.canEditEvents = true;
        }
        await BandMember.findOneAndUpdate({ _id: req.body._id, bandId: req.params.id }, req.body);
        await band.populate("bandMembers events").execPopulate();
        res.json(band);
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ e: e.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        let bandUserMembers = await BandMember.find({ userId: req.session.userId }).select("_id");
        let bandMember = await BandMember.findOne({ _id: req.params.id });
        let band = await Band.findOne({ _id: bandMember.bandId, bandMembers: { "$in": bandUserMembers } });
        var index = band.bandMembers.indexOf(bandMember._id);
        if (index !== -1) {
            band.bandMembers.splice(index, 1);
            await band.save();
        }
        await bandMember.delete();
        await band.populate("bandMembers events").execPopulate();
        res.json(band);
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ e: e.message });
    }
});

export default router;