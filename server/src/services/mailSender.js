import { createTransport } from 'nodemailer';
import arubaAuth from '../arubaAuth';

module.exports.sendMail = async (to, subject, text) => {
    let transporter = createTransport({
        host: arubaAuth.smtp,
        port: arubaAuth.port,
        secure: true,
        auth: {
            user: arubaAuth.user,
            pass: arubaAuth.pass,
        },
    });

    // send mail with defined transport object
    await transporter.sendMail({
        from: '"Info - Gig Addicted" <info@gig-addicted.com>',
        to: to,
        subject: subject,
        text: text
        // html: "<b>Hello world?</b>", // html body
    });
};