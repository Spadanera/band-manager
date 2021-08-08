"use strict";

const router = require('express').Router();
import Event from '../../models/Event';
import SetList from '../../models/SetList';

router.get("/setlist", async (req, res) => {
    try {
        res.json(await SetList.findOne());
    }
    catch (e) {
        console.error(e);
        res.status(500).json(e);
    }
});

router.post("/setlist", async (req, res) => {
    try {
        let setList = new SetList(req.body);
        await setList.save();
        res.json(setList);
    }
    catch (e) {
        console.error(e);
        res.status(500).json(e);
    }
});

router.put("/setlist/:id", async (req, res) => {
    try {
        res.json(await SetList.findOneAndUpdate({
            _id: req.params.id
        }, req.body));
    }
    catch (e) {
        console.error(e);
        res.status(500).json(e);
    }
});

router.delete("/setlist/:id", async (req, res) => {
    try {
        let setList = await SetList.findOne({ _id: req.params.id });
        setList.remove();
        res.send("Deleted");
    }
    catch (e) {
        console.error(e);
        res.status(500).json(e);
    }
});

router.get("/event", async (req, res) => {
    try {
        res.json(await Event.find());
    }
    catch (e) {
        console.error(e);
        res.status(500).json(e);
    }
});

router.get("/event/:id", async (req, res) => {
    try {
        res.json(await Event.findOne({ _id: req.params.id }));
    }
    catch (e) {
        console.error(e);
        res.status(500).json(e);
    }
});

router.post("/event", async (req, res) => {
    try {
        let event = new Event(req.body);
        await event.save();
        res.json(event);
    }
    catch (e) {
        console.error(e);
        res.status(500).json(e);
    }
});

router.put("/event/:id", async (req, res) => {
    try {
        res.json(await Event.findOneAndUpdate({
            _id: req.params.id
        }, req.body));
    }
    catch (e) {
        console.error(e);
        res.status(500).json(e);
    }
});

router.delete("/event/:id", async (req, res) => {
    try {
        let event = await Event.findOne({ _id: req.params.id });
        event.remove();
        res.send("Deleted");
    }
    catch (e) {
        console.error(e);
        res.status(500).json(e);
    }
});

export default router;