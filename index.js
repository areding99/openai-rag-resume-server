import "dotenv/config";
import cors from "cors";
import express from "express";
import runAssistantOnThread from "./functional/gpt/runAssistantOnThread.js";
import useSession from "./interface/useSession.js";

const main = () => {
  const app = express();

  useSession(app);

  app.get(
    "/test",
    cors({ origin: "http://127.0.0.1:5500", credentials: true }),
    (req, res) => {
      req.session.thread_id = "1234";

      res.send("hey there!");
    }
  );

  // two endpoints: 1) get conversation and 2) post question (which streams a response)

  // app.get("/events", cors({ origin: "http://127.0.0.1:5500" }), (req, res) => {
  //   res.setHeader("Content-Type", "text/event-stream");
  //   res.setHeader("Cache-Control", "no-cache");
  //   res.setHeader("Connection", "keep-alive");
  //   res.flushHeaders();

  //   // Send a message every second
  //   setInterval(() => {
  //     res.write(
  //       `data: The server time is: ${new Date().toLocaleTimeString()}\n\n`
  //     );
  //   }, 1000);
  // });

  app.listen(4000, () => {
    console.log("server started");
  });
};

main();
