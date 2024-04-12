import { addThreadMessage } from "../../functional/gpt/threadUtils.js";

const useWriteMessageRoute = async (app) => {
  app.post("/api/writeMessage", async (req, res, next) => {
    try {
      const threadId = req.session.thread_id;
      const message = req.body.message;

      if (!threadId) {
        throw new Error("Thread not found");
      }

      await addThreadMessage(threadId, message);

      res.status(200).send({ message: "success" });
      console.log("Message written");
    } catch (error) {
      next(error);
    }
  });
};

export default useWriteMessageRoute;
