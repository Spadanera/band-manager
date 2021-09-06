"use strict";

const router = require('express').Router();
import passport from 'passport';

import User from "../../models/User";
import BandMember from "../../models/BandMember";
import Invitation from "../../models/Invitation";

router.get('/', (req, res) => {
    if (req.query.from)
    req.session.from = req.query.from;
    res.redirect('/auth/google');
});

router.get('/google-join/:invitation', (req, res) => {  
    req.session.invitation = req.params.invitation;
    res.redirect('/auth/google');
});

router.get('/google', passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email']
}));

router.get('/checkauthentication', async (req, res) => {
    if (req.session.userId) {
        let user = await User.findOne({ _id: req.session.userId });
        if (user) {
            res.send(true);
        }
        else {
            res.send(false);
        }
    }
    else {
        res.send(false);
    }
});

router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/'
    }),
    async (req, res) => {
        try {
            let profile = req.user.profile;
            let user = await User.findOneAndUpdate({ googleId: profile.id }, {
                googleId: profile.id,
                email: profile.emails[0].value,
                token: req.user.token,
                displayName: profile.displayName,
                givenName: profile.name.given_name,
                familyName: profile.name.family_name,
                picture: profile._json.picture
            }, { upsert: true, new: true, setDefaultsOnInsert: true });
            req.session.userId = user._id;
            req.session.token = req.user.token;
            res.cookie('token', req.session.token);

            // invitation
            if (req.session.invitation) {
                let invitation = await Invitation.findOne({ token: req.session.invitation });
                let bandMember = await BandMember.findOne({ bandId: invitation.bandId, userEmailAddress: invitation.emailAddress });
                bandMember.userId = user._id;
                bandMember.userDisplayName = profile.displayName;
                bandMember.userPicture = profile._json.picture;
                await bandMember.save();
                await Invitation.findOneAndDelete({ token: req.session.invitation });
                res.redirect(`${process.env.PROTOCOL || "http"}://${process.env.ORIGIN || "localhost"}/#/band/${invitation.bandId}`);
            }
            else if (req.session.from) {
                res.redirect(decodeURIComponent(req.session.from));
                delete req.session.from;
            }
            else {
                res.redirect(`${process.env.PROTOCOL || "http"}://${process.env.ORIGIN || "localhost"}/#/bands`);
            }
        } catch (error) {
            console.log(error);
            res.redirect(`${process.env.PROTOCOL || "http"}://${process.env.ORIGIN || "localhost"}/`);
        }
    }
);
router.get('/logout', (req, res) => {
    req.logout();
    req.session = null;
    res.cookie('token', '');
    res.redirect(`${process.env.PROTOCOL || "http"}://${process.env.ORIGIN || "localhost"}/#/`);
});

export default router;