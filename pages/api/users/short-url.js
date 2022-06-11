import wrapAsync from '../../../libs/server/wrapAsync';
import { withSession } from '../../../libs/server/withSession';
import axios from 'axios';
import { findUser } from '../../../libs/server/dbFunctions';

async function handler(req, res) {
    
    if (req.method === "POST") {
        
        const { body: { email } } = req; // { session: { user }, 
        const submittedUserAccountInfo = { email };
        if (!submittedUserAccountInfo) return res.json({ ok: false });

        const foundUser = await findUser({ submittedUserAccountInfo });
        const phone = foundUser?.phone;
        if (!phone) return res.json({ ok: false });

        console.log("phone: ", phone);
        const query = encodeURI(`https://www.metalab.lol/?phone=${phone}`);
        const apiUrl = "https://naveropenapi.apigw.ntruss.com/util/v1/shorturl";

        const result = await axios({
            method: "POST",
            url: apiUrl,
            headers: {
            "Content-Type": "application/json",
            },
            data: { url: query },
            // form: { url: query },
            headers: { 'X-NCP-APIGW-API-KEY-ID': process.env.NAVER_SHORT_URL_CLIENT_ID, 'X-NCP-APIGW-API-KEY': process.env.NAVER_SHORT_URL_CLIENT_SECRET },
        })
        .then((response) => new Promise(resolve => resolve({ ok: true, ...response?.data })))
        .catch((error) => new Promise(reject => reject({ ok: false, ...error })));

        return res.json({ 
            ok: result?.ok, 
            shortUrl: result?.result?.url,
            hash: result?.result?.hash,
            originalUrl: result?.result?.orgUrl, 
            userProfile: foundUser,
            // result,
        });
    }
};

export default withSession(wrapAsync({ requestMethods: ["POST"], handler }));