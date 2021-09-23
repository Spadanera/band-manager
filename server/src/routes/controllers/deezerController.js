"use strict";

const router = require('express').Router();

import deezerSearch from '../../services/deezerSearch';

router.get("/songs", async (req, res) => {
    try {
        let searchResults = await deezerSearch.search(req.query.q, "track");
        res.json(
            searchResults
            .map(s => {
                return {
                    id: s.id,
                    title: s.title,
                    title_short: s.title_short,
                    duration: s.duration,
                    album: s.album.title,
                    author: s.artist.name,
                    preview: s.preview,
                    bpm: s.bpm
                };
            })
        );
    } catch (e) {
        console.error(e);
        res.status(500).send({ e: e.message });
    }
});

router.get("/song/:id", async (req, res) => {
    try {
        let track = await deezerSearch.track(req.params.id);
        res.json(track);
    } catch (e) {
        console.error(e);
        res.status(500).send({ e: e.message });
    }
});

router.get("/lyrics", async (req, res) => {
    try {
        let lyrics = await deezerSearch.lyrics(req.query.title, req.query.author);
        res.json(lyrics);
    } catch (e) {
        console.error(e);
        res.status(500).send({ e: e.message });
    }
});

export default router;