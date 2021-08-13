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
            res.json(await Band.findOne({ _id: invitation.bandId }).populate("bandMembers"));
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
        let invitation = req.body.invitation;
        await Invitation.findOneAndDelete({ emailAddress: invitation.emailAddress, inviterId: req.session.userId, bandId: req.body.bandId });
        invitation.inviterId = req.session.userId;
        let bandMemberInviter = await BandMember.findOne({ bandId: req.body.bandId, userId: req.session.userId, isAdmin: true });
        if (bandMemberInviter) {
            let user = await User.findOne({ email: invitation.emailAddress });
            if (user) {
                let bandMember = await BandMember.findOne({ userId: user._id, bandId: req.body.bandId });
                if (bandMember) {
                    res.status(204).send();
                    return;
                }
                else {
                    req.body.bandMember.userId = user._id;
                }
            }
            invitation.token = uuid.v4();
            let band = await Band.findOne({ _id: req.body.bandId });

            req.body.bandMember.bandId = req.body.bandId;
            req.body.bandMember.userEmailAddress = invitation.emailAddress;
            let bandMemberNew = new BandMember(req.body.bandMember);
            await bandMemberNew.save();
            band.bandMembers.push(bandMemberNew._id);
            await band.save();

            await mailSender.sendMail(invitation.emailAddress,
                `Your invitation to join ${band.name} on Gig Addicted`,
                `Open this link to join ${process.env.PROTOCOL || "http"}://${process.env.ORIGIN || "localhost"}/#/join/${invitation.token}`);
            let invitationNew = new Invitation(invitation);
            res.json(await invitationNew.save());
        }
        else {
            res.status(400).send("Band not found");
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ e: e.message });
    }
});

export default router;