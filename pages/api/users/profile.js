import wrapAsync from '../../../libs/server/wrapAsync';
import { withSession } from '../../../libs/server/withSession';
import { findUser } from '../../../libs/server/dbFunctions';

async function handler(req, res) {
  
    if (req.method === "GET") { 
  
        const { session : { user } } = req; // , query : { ...queries }
        const userId = user?.userId;

        if (!user || !userId) return res.json({ ok: false }); // !user || 

        const userProfile = await findUser({ submittedUserAccountInfo: { userId }});

        return res.json({
            ok: true,
            userId,
            isEmailVerified: userProfile?.isEmailVerified,
            isPhoneVerified: userProfile?.isPhoneVerified,
            userProfile,
            userSession: user,
        })
    }; 
  
    // "POST" request ("/profile" 페이지에서 개인 유저 정보를 업데이트 하는 경우 (ex. 유저의 "name" 수정))
  //   if (req.method === "POST") {
      
  //     const { session: { user }, body: { name } } = req;
    
  //     if (!user?.userId || !name) return res.json({ ok: false }); // res.status(404)..json({ ok: false }).end();
        
  //       await client.user.update({
  //         where: {
  //           id: user?.userId,
  //         },
  //         data: {
  //           name,
  //         },
  //       });
  
  //       return res.json({ 
  //           ok: true, 
  //       });
  //   };

  };
   
  export default withSession(wrapAsync({ requestMethods: ["GET", "POST"], handler }));