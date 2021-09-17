import { createTransport } from 'nodemailer';
import arubaAuth from '../arubaAuth';
import fs from 'fs';
import path from 'path';

module.exports.sendMail = async (to, subject, text, isHtml) => {
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
    let mail = {
        from: '"Info - Gig Addicted" <info@gig-addicted.com>',
        to: to,
        subject: subject,
        text: text
        // html: "<b>Hello world?</b>", // html body
    };

    if (isHtml) {
        mail.html = text;
    }
    else {
        mail.text = text;
    }

    await transporter.sendMail(mail);
};

module.exports.parseBody = (template, variables) => {
    let body = fs.readFileSync(path.resolve(__dirname, `../templates/${template}.html`), "utf-8");
    for (let prop in variables) {
        body = body.replace(new RegExp(`{{${prop}}}`, 'g'), variables[prop]);
    }

    return body;
};