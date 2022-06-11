import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next';

// set cookie options
const cookieOptions = {
  cookieName: "metalab_cookie", // 생성할 cookie 이름
  password: process.env.COOKIE_OPTIONS_PASSWORD, // 생성할 cookie 암호화 및 cookie 해석할 때 필요한 cookie password
  secure: process.env.NODE_ENV === "development", // deploy할 때 NODE_ENV === "production"으로 수정
};

// withSession is a function for handling regular Iron-Session
export function withSession(fn) {
  return withIronSessionApiRoute(fn, cookieOptions);
};

// withSsrSession is a function for handling SSR(Server-Side-Rendering) based Iron-Session
export function withSsrSession(fn) {
  return withIronSessionSsr(fn, cookieOptions);
}; 