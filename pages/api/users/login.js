import wrapAsync from '../../../libs/server/wrapAsync';
import { withSession } from '../../../libs/server/withSession';
import { connectOrCreateUser } from '../../../libs/server/dbFunctions'; // , findUser, findUserWithPassword
 
async function handler(req, res) {

    if (req.method === "POST") {

        const beginTime = new Date();
        const { body: { email } } = req; // , session: { user } 
        const submittedUserAccountInfo = { email }; // userId: user?.userId
        if (!submittedUserAccountInfo) return res.json({ ok: false }); // .status(404)

        // const foundUser = await findUserWithPassword({ submittedUserAccountInfo });
        // console.log("foundUser", foundUser);

        // if (user?.userId && user?.userId === foundUser?.userId && foundUser?.passwordHash) {
        //     req.session.user = {
        //     //   ...req?.session?.user,
        //       userId: foundUser?.userId,
        //       isEmailVerified: foundUser?.isEmailVerified,
        //       isPhoneVerified: foundUser?.isPhoneVerified,
        //       isLoggedIn: true,
        //     }; 

        //     // 새로운 세션 생성
        //     await req.session.save();
            
        //     const endTime = new Date();
        //     const processedTime = (endTime - beginTime) / 1000;
            
        //     return res.json({ 
        //         ok: true,
        //         userId: user?.userId,
        //         processedTime,
        //         userProfile: foundUser,
        //         userSession: req?.session?.user,
        //         submittedUserAccountInfo,
        //     });
        // }

        // else {
            const userProfile = await connectOrCreateUser({ submittedUserAccountInfo });
            if (!userProfile?.ok) return res.json({ ok: false });

            // 기존에 있던 세션이 존재하면 삭제
            // await req.session.destroy();

            req.session.user = {
            userId: userProfile?.user?.userId,
            isLoggedIn: userProfile?.isNewAccountCreated, 
            isEmailVerified: userProfile?.user?.isEmailVerified,
            isPhoneVerified: userProfile?.user?.isPhoneVerified,
            };

            // 새로운 세션 생성
            await req.session.save();
            
            const endTime = new Date();
            const processedTime = (endTime - beginTime) / 1000;
            
            return res.json({ 
                ok: true,
                userId: userProfile?.user?.userId,
                processedTime,
                userProfile,
                userSession: req?.session?.user,
                submittedUserAccountInfo,
            });
        // };
    };
};
export default withSession(wrapAsync({ requestMethods: ["POST"], handler })); 