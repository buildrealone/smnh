import wrapAsync from '../../../libs/server/wrapAsync';
import { withSession } from '../../../libs/server/withSession';
import axios from 'axios';
import CryptoJS from 'crypto-js';
// import { findUser } from '../../../libs/server/dbFunctions';

async function handler(req, res) {

    if (req.method === "POST") {
    
        const { body: { phone } } = req; // session: { user }, 
        if (!phone) return res.json({ ok: false });

        // const foundUser = await findUser({ submittedUserAccountInfo: { phone } });
        // if (foundUser?.isPhoneVerified) return res.json({ ok: false });

        const dateNow = Date.now().toString();
        const method = "POST";
        const space = " ";
        const newLine = "\n";
        const url = `https://sens.apigw.ntruss.com/sms/v2/services/${process.env.NAVER_SENSE_SERVICE_ID}/messages`;
        const url2 = `/sms/v2/services/${process.env.NAVER_SENSE_SERVICE_ID}/messages`;

        const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, process.env.NAVER_CLOUD_SECRET_KEY);

        hmac.update(method);
        hmac.update(space);
        hmac.update(url2);
        hmac.update(newLine);
        hmac.update(dateNow);
        hmac.update(newLine);
        hmac.update(process.env.NAVER_CLOUD_ACCESS_KEY_ID);

        const HASH = hmac.finalize();
        const SIGNATURE = HASH.toString(CryptoJS.enc.Base64);

        const result = await axios({
            method: "POST",
            url,
            headers: {
                "Contenc-type": "application/json; charset=utf-8",
                "x-ncp-iam-access-key": process.env.NAVER_CLOUD_ACCESS_KEY_ID,
                "x-ncp-apigw-timestamp": dateNow,
                "x-ncp-apigw-signature-v2": SIGNATURE,
            },
            data: {
                type: "SMS",
                countryCode: "82",
                from: process.env.SMS_SENDER_PHONE_NUMBER,
                
                // content: `[서대문자연사박물관]\n인증번호: [${userVerificationCode}]`,
                content: `[서대문박물관 휴대폰 번호 인증 완료!]`, // \n\n링크: ${shortUrl}

                messages: [
                    { to: `${phone}`, },
                ],
            },
        })
        .then((response) => new Promise(resolve => resolve({ ok: true, ...response })))
        .catch((error) => new Promise(reject => reject({ ok: false, ...error })));

        return res.json({ 
            ok: result?.ok,
        });

    };
};

export default withSession(wrapAsync({ requestMethods: ["POST"], handler }));