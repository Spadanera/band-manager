import { createTransport } from 'nodemailer';
import gmailAuth from '../gmailAuth';

module.exports.sendMail = (to, subject, text) => {
    return new Promise((resolve, reject) => {
        var transporter = createTransport({
            service: 'gmail',
            auth: gmailAuth
        });

        var mailOptions = {
            from: 'info@bandmanager.com',
            to: to,
            subject: subject,
            text: text
        };
        if (gmailAuth.pass && gmailAuth.user) {
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    reject(error);
                } else {
                    resolve(info);
                }
            });
        }
        else {
            resolve();
        }
    });
};