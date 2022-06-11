import wrapAsync from '../../../libs/server/wrapAsync';
import { withSession } from '../../../libs/server/withSession';
import { authenticateUserPassword, findUser } from '../../../libs/server/dbFunctions'; // updateUserLoggedInStatus

async function handler(req, res) {
    
    if (req.method === "POST") {
        
        const beginTime = new Date();

        const { body: { email, password } } = req; // session: { user }, 
        const submittedUserAccountInfo = { email };
        if (!submittedUserAccountInfo || !password) return res.status(404).json({ ok: false });

        const isAuthenticated = await authenticateUserPassword({ submittedUserAccountInfo, submittedPassword: password });
        if (!isAuthenticated) return res.json({ ok: false });
        
        // const isLoggedIn = await updateUserLoggedInStatus({ submittedUserAccountInfo });
        // if (!isLoggedIn) return res.json({ ok: false });

        const foundUser = await findUser({ submittedUserAccountInfo });
        if (!foundUser) return res.json({ ok: false });

        req.session.user = {
          userId: foundUser?.userId,
          isLoggedIn: true,
          isEmailVerified: foundUser?.isEmailVerified,
          isPhoneVerified: foundUser?.isPhoneVerified,
        };

        // // 새로운 세션 생성
        await req.session.save();

        const endTime = new Date();
        const processedTime = (endTime - beginTime) / 1000;

        // console.log("User Session Data: ", req?.session);
    
        return res.json({ 
          ok: true, 
          processedTime, 
          userProfile: foundUser,
          userSession: req?.session?.user,
          // submittedUserAccountInfo,
        });

    };
};

export default withSession(wrapAsync({ requestMethods: ["POST"], handler }));