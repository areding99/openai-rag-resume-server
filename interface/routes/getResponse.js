import {
  getThread,
  getFormattedThreadMessages,
} from "../../functional/gpt/threadUtils.js";
import { USER_ROLE } from "../../functional/gpt/constants.js";
import getOpenAIClient from "../../functional/gpt/getOpenAIClient.js";
import getOrCreateAssistant from "../../functional/gpt/getOrCreateAssistant.js";

const useGetResponseRoute = async (app) => {
  app.get("/api/response", async (req, res, next) => {
    try {
      const threadId = req.session.thread_id;

      if (!threadId) {
        throw new Error("Thread not found");
      }

      const thread = await getThread(threadId);
      const existingMessages = await getFormattedThreadMessages(thread);

      if (existingMessages[existingMessages.length - 1]?.role != USER_ROLE) {
        throw new Error(
          "The most recent message has a response & cannot be streamed"
        );
      }

      const client = getOpenAIClient();
      const assistant = await getOrCreateAssistant();

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.flushHeaders();

      await new Promise((resolve, reject) => {
        client.beta.threads.runs
          .createAndStream(threadId, {
            assistant_id: assistant.id,
          })
          .on("textDelta", (textDelta, snapshot) => {
            res.write(
              `data: ${JSON.stringify({
                textDelta,
              })}\n\n`
            );
          })
          .on("end", resolve)
          .on("error", reject);
      });

      res.write("event: CLOSE\ndata: Connection will be closed\n\n");
      res.end();
    } catch (error) {
      console.log(error);
      next(error);
    }
  });
};

export default useGetResponseRoute;
