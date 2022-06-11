import wrapAsync from '../../../libs/server/wrapAsync';
import { withSession } from '../../../libs/server/withSession';
import nodemailer from 'nodemailer';
import email_form_v2 from '../../../libs/email/email_form_v2';
import { findUser } from '../../../libs/server/dbFunctions';

async function handler(req, res) {

    if (req.method === "POST") {

        const beginTime = new Date();
        const { body: { submittedUserAccountInfo } } = req; // session: { user }, 
        const userEmail = submittedUserAccountInfo?.email;
        if (!userEmail) return res.json({ ok: false });
        
        const foundUser = await findUser({ submittedUserAccountInfo });
        if (foundUser?.isEmailVerified) return res.json({ ok: false });

        // const userVerificationCode = Math.floor(1000 + Math.random() * 9000) + "";

        const redirectUrl = `https://www.metalab.lol?email=${userEmail}`;

        const smtpTransport = nodemailer.createTransport({
            service: "naver",
            host: "smtp.naver.com",
            port: 587,
            auth: {
                user: process.env.NAVER_EMAIL_SENDER,
                pass: process.env.NAVER_EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.NAVER_EMAIL_SENDER,
            to: userEmail,
            subject: "서대문자연사박물관 본인 인증 이메일",
            html: email_form_v2({ redirectUrl, submittedDate: beginTime }),
        };

        const result = await smtpTransport?.sendMail(mailOptions)
        .then((response) => {
            smtpTransport?.close();
            return new Promise(resolve => resolve({ ok: true })) // { ok: true, ...response }
        })
        .catch((error) => {
            smtpTransport?.close();
            return new Promise(reject => reject({ ok: false })); // { ok: false, ...error }
        });

        const endTime = new Date();
        const processedTime = (endTime - beginTime) / 1000;

        return res.json({ 
            ok: result?.ok, 
            submittedUserAccountInfo,
            processedTime,
        });

    }; 
};

export default withSession(wrapAsync({ requestMethods: ["POST"], handler }));