"use strict";

const router = require('express').Router();
import Band from '../../models/Band';
import BandMember from '../../models/BandMember';

router.put("/:id", async (req, res) => {
    try {
        res.json(await BandMember.findOneAndUpdate({ _id: req.body._id, bandId: req.params.id }, req.body));
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ e: e.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        let bandMember = await BandMember.findOne({ _id: req.params.id });
        let band = await Band.findOne({ _id: bandMember.bandId });
        var index = band.bandMembers.indexOf(bandMember._id);
        if (index !== -1) {
            band.bandMembers.splice(index, 1);
            await band.save();
        }
        res.json(await bandMember.delete());
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ e: e.message });
    }
});

export default router;