import wrapAsync from '../../../libs/server/wrapAsync';
import { withSession } from '../../../libs/server/withSession';
import { updateUserPhone } from '../../../libs/server/dbFunctions';

async function handler(req, res) {
    
    if (req.method === "POST") {
        
        const beginTime = new Date(); 

        const { body: { email, phone } } = req;
        const submittedUserAccountInfo = { email };
        // return res.json({ submittedUserAccountInfo, newPassword });

        if (!submittedUserAccountInfo || !phone) return res.status(404).json({ ok: false });

        const isPhoneUpdated = await updateUserPhone({ submittedUserAccountInfo, phone });
        if (!isPhoneUpdated) return res.json({ ok: false });
        
        const endTime = new Date();
        const processedTime = (endTime - beginTime) / 1000;

        return res.json({ ok: true, processedTime, submittedUserAccountInfo });

    };
};

export default withSession(wrapAsync({ requestMethods: ["POST"], handler }));