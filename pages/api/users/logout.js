import wrapAsync from '../../../libs/server/wrapAsync';
import { withSession } from '../../../libs/server/withSession';
// import { findUser } from '../../../libs/server/dbFunctions';
 
async function handler(req, res) {

    if (req.method === "POST") {

        const beginTime = new Date();

        const { body: { userId }, session: { user } } = req;
        
        const submittedUserAccountInfo = { userId: user?.userId };
        
        if (!submittedUserAccountInfo || userId !== user?.userId) return res.status(404).json({ ok: false });

        req.session.user = {
            ...req?.session?.user,
          isLoggedIn: false,
          //   userId: foundUser?.userId,
          //   isVerified: foundUser?.isVerified,
        }; 

        // 새로운 세션 생성
        await req.session.save();
        
        const endTime = new Date();
        const processedTime = (endTime - beginTime) / 1000;
        
        return res.json({ 
            ok: true,
            processedTime,
            userSession: req?.session?.user,
            submittedUserAccountInfo,
            // userId: foundUser?.userId,
            // userProfile: foundUser,
        });

    };
};
export default withSession(wrapAsync({ requestMethods: ["POST"], handler })); 