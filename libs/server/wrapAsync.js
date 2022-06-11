// export interface ResponseType {
//   ok: boolean;
//   [key: string]: any;
// }

// type method = "GET" | "POST" | "DELETE";

// interface ConfigType {
//  methods: method[];
//  handler: (req: NextApiRequest, res: NextApiResponse) => void;
//  isPrivatePage?: boolean;
//  isAdminPage?: boolean;
// }

export default function wrapAsync({
    requestMethods, // ex. ["GET", "POST"] || ["GET"] || ["POST"]
    handler, // execute하고 싶은 handler function
    isPrivatePage = false, // 로그인 상태인 경우에만 볼 수 있는 페이지 유무
    isAdminPage = false, // Admin 계정만 볼 수 있는 페이지 유무,
  }){
    
    return async function (req, res) {

      // isAdminPage === true && 유저 브라우저에 세션이 없는 경우 (ex. Admin 페이지로 접속하려는데 로그인 상태가 아닌 경우)
      // status(403): Forbidden; The client does have access rights to the content
      if (isAdminPage && !req.session.user) {
        return res.status(403).json({
          isProcessed: false,
          error: "AN ADMIN ACCOUNT LOGIN IS REQUIRED."
        })
      };


      // isPrivatePage === true && 유저 브라우저에 세션이 없는 경우 (ex. 개인 페이지로 접속하려는데 로그인 상태가 아닌 경우)
      // status(401): Unauthorized; unauthenticated (client error response)
      if (isPrivatePage && !req.session.user) {
        return res.status(401).json({ 
            isProcessed: false, 
            error: "A LOGIN IS REQUIRED." 
        });
      };

      // request 요청이 존재하지만, request method가 불일치하는 경우 (ex. "GET" !== "POST")
      // status(405): Method Not Allowed; request method is not supported by the target source (client error response)
      if (req.method && !requestMethods.includes(req.method)) {
        return res.status(405).json({
          isProcessed: false,
          error: "REQUEST METHOD NOT ALLOWED"
        }); 
      };

      // *request 요청이 정상인 경우: handler function 실행
      try {
        await handler(req, res);
      } 
      // status(500): Internal Server Error (server error response)
      catch (error) {
        return res.status(500).json({ error });
      };

    };
  };