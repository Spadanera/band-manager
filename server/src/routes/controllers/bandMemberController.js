"use strict";

const router = require('express').Router();
import Player from "../../models/BandMember";
import Chronicle from '../../models/Chronicle';

// get all by chronicle id
router.get("/all/:id", async (req, res) => {
    try {
        let chronicle = Chronicle.findOne({ storyTeller: req.session.userId, _id: req.params.id });
        if (chronicle) {
            let players = await Player.find({ chronicleId: req.params.id, active: true }).populate("characters", "alive");
            res.json(players.sort((a, b) => a.createdAt < b.createdAt));
        }
        else {
            res.status(500).json({ error: "User not authorized to get players of this chronicle" });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json(e);
    }
});

// get all player character by chronicle id
router.get("/all-characters/:id", async (req, res) => {
    try {
        let chronicle = Chronicle.findOne({ storyTeller: req.session.userId, _id: req.params.id });
        if (chronicle) {
            let players = await Player.find({ chronicleId: req.params.id, active: true }).populate("characters");
            let response = [];
            players.forEach(player => {
                response = response.concat(player.characters.filter(character => character.alive === "alive" ));
            });
            res.json(response);
        }
    } catch (e) {
        console.error(e);
        res.status(500).json(e);
    }
});

router.get("/characters/:chronicleid", async (req, res) => {
    try {
        let player = await Player.findOne({ userId: req.session.userId, chronicleId: req.params.chronicleid }).populate("characters");
        res.json(player.characters);
    } catch (e) {
        console.error(e);
        res.status(500).json(e);
    }
});

router.get("/:id/characters", async (req, res) => {
    try {
        let chronicles = await Chronicle.find({ storyTeller: req.session.userId }).select("_id");
        if (chronicles) {
            res.json(await Player.findOne({ _id: req.params.id, chronicleId: { "$in": chronicles } }).populate("characters"));
        }
        else {
            res.status(500).json({ error: "User not authorized to get characters of this player" });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json(e);
    }
});

export default router;