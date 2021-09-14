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
                outputBand.setlists = band.setlists;
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
                delete event.setlists;
            }
        }
        if (!band.isMembersPublic) {
            delete band.bandMembers;
        }
        if (!band.isSetlistPublic) {
            delete band.setlists;
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
        let outputEvents = [];
        if (events) {
            for (let i = 0; i < events.length; i++) {
                if (!events[i].isSetlistPublic) {
                    delete events[i].setlist;
                }
                if (events[i].eventDate >= (new Date()).toISOString().split("T").shift()) {
                    let band = await Band.findOne({ _id: events[i].bandId }).select("name description logo location type tributeArtist genres isPublic");
                    if (band.isPublic) {
                        let outputEvent = JSON.parse(JSON.stringify(events[i]));
                        outputEvent.band = band;
                        if (events[i].locationAddress) {
                            outputEvent.location_address = JSON.parse(events[i].locationAddress);
                        }
                        outputEvents.push(outputEvent);
                    }
                }
            }
        }
        res.json(outputEvents);
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ e: e.message });
    }
});

export default router;