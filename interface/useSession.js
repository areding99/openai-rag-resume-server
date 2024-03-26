import { __prod__ } from "../lib/constants.js";
import session from "express-session";
import Redis from "ioredis";
import RedisStore from "connect-redis";

const useSession = (app) => {
  /* 
  Context for overwrite:
  -> request is issued from a different origin than the server - this is 
    okay as long as origin is whitelisted for cors options but requires 
    the cookie's sameSite attribute to be 'none' 

  As a result of the above: 
  -> the cookie's secure attribute must be true (due to sameSite: 'none')

  The issue: 
  -> express-session won't set a cookie with the secure attribute unless the request is secure
  -> in dev, the request is not secure

  The solution:
  -> override the request's secure attribute in dev 
  */

  app.use((req, _res, next) => {
    if (!__prod__) {
      Object.defineProperty(req, "secure", { value: true });
    }

    next();
  });

  app.use(
    session({
      name: "ANDY_REDING_QA_SESSION",
      // Redis() connects to localhost:6379 by default
      store: new RedisStore({ client: new Redis() }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24, // one day
        httpOnly: true,
        secure: true,
        sameSite: "none",
      },
      resave: false,
      saveUninitialized: true,
      secret: "don't_tell_u_promised",
    })
  );
};

export default useSession;
