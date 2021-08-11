"use strict";

const router = require('express').Router();
import Band from '../../models/Band';
import BandMember from '../../models/BandMember';
import User from '../../models/User';
import Event from '../../models/Event';
import fs from 'fs';
import imageToUri from 'image-to-uri';

router.get("/", async (req, res) => {
    try {
        let bandMembers = await BandMember.find({ userId: req.session.userId }).select("_id");
        res.json(await Band.find({ bandMembers: { "$in": bandMembers } }).populate("bandMembers"));
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
        let bandMembers = await BandMember.find({ userId: req.session.userId }).select("_id");
        let band = await Band.findOne({ _id: req.params.id, bandMembers: { "$in": bandMembers } }).populate("bandMembers events");
        res.json(band); 
    }
    catch (e) {
        console.error(e);
        res.status(500).json({e: e.message });
    }
});

router.get("/memberinfo/:id", async (req, res) => {
    try {
        let bandMember = await BandMember.findOne({ userId: req.session.userId, bandId: req.params.id }); 
        res.json(bandMember); 
    }
    catch (e) {
        console.error(e);
        res.status(500).json({e: e.message });
    }
});

router.post("/", async (req, res) => {
    try {
        let band = new Band(req.body);
        band.creatorId = req.session.userId;
        if (!band.bandLogo) {
            band.bandLogo = {};
        }
        if (!band.genres) {
            band.genres = [];
        }
        if (!band.setList) {
            band.setList = [];
        }
        await band.save();
        let user = await User.findOne({ _id: req.session.userId });
        let bandMember = new BandMember({
            userId: req.session.userId,
            userDisplayName: user.displayName,
            userPicture: user.picture,
            bandId: band._id,
            isAdmin: true,
            isCreator: false
        });
        await bandMember.save();
        band.bandMembers.push(bandMember._id);
        res.json(await band.save());
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ e: e.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        let bandMember = await BandMember({ userId: req.session.userId, bandId: req.params.id, isAdmin: true });
        if (bandMember && req.params.id === req.body._id) {
            res.json(await Band.findOneAndUpdate({ _id: req.params.id }, req.body));
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

router.delete("/:id", async (req, res) => {
    try {
        let bandMember = await BandMember.findOne({ userId: req.session.userId, bandId: req.params.id, isAdmin: true });
        if (bandMember) {
            let band = await Band.findOne({ _id: req.params.id });
            for (let i = 0; i < band.bandMembers.length; i++) {
                await BandMember.findOneAndDelete({ _id: band.bandMembers[i] });
            }
            for (let i = 0; i < band.events.length; i++) {
                await Event.findOneAndDelete({ _id: band.events[i]._id });
            }
            res.json(await Band.findOneAndDelete({ _id: req.params.id }));
        }
        else {
            res.status(401).send("Unauthorized");
        }
    }
    catch (e) {
        console.error(e);
        res.status(500).json({e: e.message });
    }
});

router.post("/logo/:id", async (req, res) => {
    try {
        if (req.files && req.files.file) {
            let bandMembers = await BandMember.find({ userId: req.session.userId }).select("_id");
            let band = await Band.findOne({ _id: req.params.id, bandMembers: { "$in": bandMembers } });
            if (band) {
                if (!band.bandLogo) {
                    band.bandLogo = {};
                }
                if (/image/.test(band.bandLogo.fileType)) {
                    band.bandLogo.file = imageToUri(req.files.file.path);
                }
                band.bandLogo.base64 = base64_encode(req.files.file.path);
                await Band.findOneAndUpdate({ _id: req.params.id }, band);
                res.json(band);
            }
            else {
                throw new Error("Attachment noy found");
            }
        }
        else {
            throw "Missing file";
        }
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ e: e.message });
    }
});

function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}

export default router;