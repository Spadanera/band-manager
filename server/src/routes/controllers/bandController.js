"use strict";

const router = require('express').Router();
import Band from '../../models/Band';
import BandMember from '../../models/BandMember';
import User from '../../models/User';
import Event from '../../models/Event';
import Setlist from '../../models/Setlist';

router.get("/", async (req, res) => {
    try {
        let bandMembers = await BandMember.find({ userId: req.session.userId }).select("_id");
        let bands = await Band.find({ bandMembers: { "$in": bandMembers } }).populate("bandMembers");
        for (var i = 0; i < bands.length; i++) {
            bands[i].memberInfo = await BandMember.findOne({ userId: req.session.userId, bandId: bands[i]._id });
            if (!bands[i].newSchema) {
                let setlist = new Setlist({
                    bandId: bands[i]._id,
                    title: "Principal",
                    songs: bands[i].setList
                });
                for (var j = 0; j < bands[i].events.length; j++) {
                    let event = await Event.findOne({ _id: bands[i].events[j] });
                    event.setlist = event.setList;
                    await event.save();
                }
                await setlist.save();
                bands[i].setlists = [];
                bands[i].setlists.push(setlist._id);
                bands[i].newSchema = true;
                await bands[i].save();
            }
        }
        res.json(bands);
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ e: e.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        let bandMembers = await BandMember.find({ userId: req.session.userId }).select("_id");
        let band = await Band.findOne({ _id: req.params.id, bandMembers: { "$in": bandMembers } }).populate("bandMembers events setlists");
        res.json(band);
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ e: e.message });
    }
});

router.get("/memberinfo/:id", async (req, res) => {
    try {
        let bandMember = await BandMember.findOne({ userId: req.session.userId, bandId: req.params.id });
        res.json(bandMember);
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ e: e.message });
    }
});

router.post("/", async (req, res) => {
    try {
        let band = new Band(req.body);
        band.creatorId = req.session.userId;
        if (!band.genres) {
            band.genres = [];
        }
        if (!band.setList) {
            band.setList = [];
        }
        if (!band.setlists) {
            band.setlists = [];
        }
        await band.save();
        let user = await User.findOne({ _id: req.session.userId });
        let bandMember = new BandMember({
            userId: req.session.userId,
            userDisplayName: user.displayName,
            userPicture: user.picture,
            userEmailAddress: user.email,
            bandId: band._id,
            isAdmin: true,
            isCreator: true,
            canEditMembers: true,
            canEditInfo: true,
            canEditSetlist: true,
            canEditEvents: true,
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

router.put("/:id/:element", async (req, res) => {
    try {
        let bandMember = await BandMember({ userId: req.session.userId, bandId: req.params.id, isAdmin: true });
        if (bandMember && req.params.id === req.body._id) {
            let band = formatSetlist(req.body);
            let _band = await Band.findOne({ _id: req.params.id }).populate("bandMembers events setlists");
            switch (req.params.element) {
                case 'generalinfo':
                    band.setList = _band.setList;
                    band.setlists = _band.setlists;
                    band.bandMembers = _band.bandMembers;
                    band.events = _band.events;
                    await Band.findOneAndUpdate({ _id: req.params.id }, band);
                    break;
                case 'setlist':
                    let setlists = JSON.parse(JSON.stringify(_band.setlists));
                    _band.setlists = [];
                    let i;
                    for (i = 0; i < band.setlists.length; i++) {
                        if (!band.setlists[i]._id) {
                            let setlist = new Setlist(band.setlists[i]);
                            await setlist.save();
                            _band.setlists.push(setlist._id);
                        }
                        else {
                            await Setlist.findOneAndUpdate({ _id: band.setlists[i]._id }, band.setlists[i]);
                            _band.setlists.push(band.setlists[i]._id);
                        }
                    }
                    // for (i = 0; i < setlists.length; i++) {
                    //     let _id = setlists[i]._id;
                    //     if (!(band.setlists.find(function (s) {
                    //         return s._id === _id;    
                    //     }))) {
                    //         await Setlist.findOneAndDelete({ _id: setlists._id });
                    //     }
                    // }
                    await _band.save();
                    break;
                case 'bandmembers':
                    _band.bandMembers = band.bandmembers;
                    await _band.save();
                    break;
                case 'events':
                    _band.events = band.events;
                    await _band.save();
                    break;
                default:
                    break;

            }

            await _band.populate("bandMembers events setlists").execPopulate();
            res.json(_band);
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
        res.status(500).json({ e: e.message });
    }
});

function formatSetlist(band) {
    let setList = band.setList;
    if (setList) {
        for (let i = 0; i < setList.length; i++) {
            let song = setList[i];
            if (song.status === "confirmed") {
                song.live = true;
            }
            else {
                song.live = false;
            }
        }
    }
    return band;
}

export default router;