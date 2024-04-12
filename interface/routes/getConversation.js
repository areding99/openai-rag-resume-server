import {
  createNewThread,
  getThread,
  getFormattedThreadMessages,
} from "../../functional/gpt/threadUtils.js";

const useGetConversationRoute = async (app) => {
  app.get("/api/getConversation", async (req, res, next) => {
    try {
      const threadId = req.session.thread_id;

      let thread = null;

      if (!threadId) {
        thread = await createNewThread();

        req.session.thread_id = thread.id;
      } else {
        thread = await getThread(threadId);
      }

      const messages = await getFormattedThreadMessages(thread);

      res.send(messages);
    } catch (error) {
      next(error);
    }
  });
};

export default useGetConversationRoute;
