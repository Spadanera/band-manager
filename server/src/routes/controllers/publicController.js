"use strict";

const router = require('express').Router();
import Band from '../../models/Band';
import Event from '../../models/Event';

router.get("/band", async (req, res) => {
    try {
        let bands = await Band.find({ isPublic: true }).populate("bandMembers events setlists");
        let outputBands = [];
        for (let i = 0; i < bands.length; i++) {
            let band = bands[i];
            band.events = band.events || [];
            let outputBand = {
                name: band.name,
                description: band.description,
                bandMembers: band.bandMembers,
                logo: band.logo,
                type: band.type,
                tributeArtist: band.tributeArtist,
                genres: band.genres,
                events: band.events.filter(e => e.isPublic),
                isMembersPublic: band.isMembersPublic,
                isSetlistPublic: band.isSetlistPublic
            };
            if (bands.isMembersPublic) {
                outputBand.bandMembers = band.bandMembers;
            }
            if (band.isSetlistPublic) {
                outputBand.setList = band.setList;
            }
            if (band.location) {
                outputBand.location_address = JSON.parse(band.location);
            }
            else {
                outputBand.location_address = {};
            }
            outputBands.push(outputBand);
        }
        res.json(outputBands);
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ e: e.message });
    }
});

router.get("/band/:id", async (req, res) => {
    try {
        let band = await Band.findOne({ _id: req.params.id, isPublic: true }).populate("bandMembers events setlists");
        delete band.creatorUserId;
        band.events = band.events || [];
        band.events = band.events.filter(e => e.isPublic);
        for (let i = 0; i < band.events.length; i++) {
            let event = band.events[i];
            if (!event.isSetlistPublic) {
                delete event.setList;
            }
        }
        if (!band.isMembersPublic) {
            delete band.bandMembers;
        }
        if (!band.isSetlistPublic) {
            delete band.setList;
        }
        if (band.location) {
            band.location_address = JSON.parse(band.location);
        }
        else {
            band.location_address = {};
        }
        res.json(band);
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ e: e.message });
    }
});

router.get("/event", async (req, res) => {
    try {
        let events = await Event.find({ isPublic: true });
        if (events) {
            for (let i = 0; i < events.length; i++) {
                if (!events[i].isSetlistPublic) {
                    delete events[i].setList;
                }
                events[i].band = Band.find({ _id: events[i]._id }).select("name description logo location type tributeArtist genres isPublic");
            }
            events = events.filter(e => e.band.isPublic);
        }
        res.json(events);
    }
    catch (e) {
        console.error(e);
        res.status(500).json(e);
    }
});

export default router;