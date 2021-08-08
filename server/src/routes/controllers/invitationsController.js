"use strict";

const router = require('express').Router();
import Invitation from "../../models/Invitation";
import Band from "../../models/Band";
import BandMember from "../../models/BandMember";
import User from "../../models/User";
import mailSender from "../../services/mailSender";
import uuid from "uuid";

router.get("/all/:id", async (req, res) => {
    try {
        res.json(await Invitation.find({ bandId: req.params.id, inviterId: req.session.userId }));
    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
});

router.get("/band/:id", async (req, res) => {
    try {
        let invitation = await Invitation.findOne({ token: req.params.id });
        if (invitation) {
            res.json(await Band.findOne({ _id: invitation.bandId }).select('name shortDescription createdAt'));
        }
        else {
            res.status("400").send("Invitation not found");
        }
    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
});

router.delete("/:id", async (req, res) => {
    try {
        await Invitation.findOneAndDelete({ _id: req.params.id, inviterId: req.session.userId });
        res.status(204).send();
    }
    catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
});

router.post("/", async (req, res) => {
    try {
        await Invitation.findOneAndDelete({ emailAddress: req.body.emailAddress, inviterId: req.session.userId, bandId: req.body.bandId });
        req.body.inviterId = req.session.userId;
        let band = await Band.findOne({ _id: req.body.bandId, storyTeller: req.session.userId });
        if (band) {
            let user = await User.findOne({ email: req.body.emailAddress });
            if (user) {
                let bandMember = await BandMember.findOne({ userId: user._id, bandId: req.body.bandId });
                if (bandMember) {
                    res.status(204).send();
                    return;
                }
            }
            req.body.token = uuid.v4();
            await mailSender.sendMail(req.body.emailAddress,
                `Your invitation to join ${band.name} on Band Manager`,
                `Open this link to join ${process.env.PROTOCOL || "http"}://${process.env.ORIGIN || "localhost"}/#/join/${req.body.token}`);
            let invitation = new Invitation(req.body);
            res.json(await invitation.save());
        }
        else {
            res.status(400).send("Band not found");
        }
    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
});

export default router;