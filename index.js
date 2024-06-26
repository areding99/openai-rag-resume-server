import "dotenv/config";
import cors from "cors";
import express from "express";
import useSession from "./interface/useSession.js";
import useGetConversationRoute from "./interface/routes/getConversation.js";
import useGetResponseRoute from "./interface/routes/getResponse.js";
import useWriteMessageRoute from "./interface/routes/postMessage.js";

const main = () => {
  // configure up express server
  const app = express();
  app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
  app.use(express.json());
  useSession(app);

  app.use((req, res, next) => {
    console.log(req.url);
    next();
  });

  // routes
  useGetConversationRoute(app);
  useGetResponseRoute(app);
  useWriteMessageRoute(app);

  // start server
  app.listen(process.env.PORT || 4000, () => {
    console.log("server started");
  });
};

main();
