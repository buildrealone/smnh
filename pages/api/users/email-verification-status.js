import wrapAsync from '../../../libs/server/wrapAsync';
import { withSession } from '../../../libs/server/withSession';
import { findUser, updateUserEmailVerificationStatus } from '../../../libs/server/dbFunctions';

async function handler(req, res) { 

  if (req.method === "POST") {

    const beginTime = new Date();
    
    const { body: { email } } = req;

    const verifyingUserAccountInfo = { email };
    if (!verifyingUserAccountInfo) return res.status(404).json({ ok: false });

    // const foundUserVerificationCode = await findUserVerificationCode({ submittedUserAccountInfo });
    // if (!foundUserVerificationCode) return res.status(404).json({ ok: false });

    const updatedUserVerificationStatus = await updateUserEmailVerificationStatus({ verifyingUserAccountInfo });
    if (!updatedUserVerificationStatus) return res.json({ ok: false });
    
    const foundUser = await findUser({ submittedUserAccountInfo: verifyingUserAccountInfo });
    if (!foundUser) return res.json({ ok: false });

    req.session.user = {
      userId: foundUser?.userId,
      isLoggedIn: true,
      isEmailVerified: true,
      isPhoneVerified: foundUser?.isPhoneVerified,
    };

    // // 새로운 세션 생성
    await req.session.save();
    
    const endTime = new Date();
    const processedTime = (endTime - beginTime) / 1000;

    // console.log("User Session Data (verification-status): ", req?.session);
    return res.json({ 
      ok: true, 
      processedTime,
      userProfile: foundUser,
      userSession: req?.session?.user,
   });

  };

};

export default withSession(wrapAsync({ requestMethods: ["POST"], handler }));