import axios from 'axios';

export default function useShortUrl({ userPhoneNumber }) {
    const query = encodeURI(`https://www.metalab.lol/?phone=${userPhoneNumber}`);
    const apiUrl = "https://naveropenapi.apigw.ntruss.com/util/v1/shorturl";

    const result = axios({
        method: "POST",
        url: apiUrl,
        headers: {
        "Content-Type": "application/json",
        },
        data: { url: query },
        // form: { url: query },
        headers: { 'X-NCP-APIGW-API-KEY-ID': process.env.NAVER_SHORT_URL_CLIENT_ID, 'X-NCP-APIGW-API-KEY': process.env.NAVER_SHORT_URL_CLIENT_SECRET },
    })
    // .then((response) => new Promise(resolve => resolve({ ok: true, ...response?.data })))
    // .catch((error) => new Promise(reject => reject({ ok: false, ...error })));
    .then((response) => { return { ok: true, ...response?.data }})
    .catch((error) => { return { ok: true, ...error }})

    return result;

};