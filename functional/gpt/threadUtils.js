import { ASSISTANT_ROLE, USER_ROLE } from "./constants.js";
import { ASSISTANT_INITIAL_MESSAGE } from "./prompts.js";
import getOpenAIClient from "./getOpenAIClient.js";

export const getThread = async (threadId) => {
  const client = getOpenAIClient();

  return await client.beta.threads.retrieve(threadId);
};

export const createNewThread = async () => {
  const client = getOpenAIClient();

  const thread = await client.beta.threads.create({
    messages: [],
  });

  return thread;
};

export const getFormattedThreadMessages = async (thread) => {
  const client = getOpenAIClient();
  const runsObj = await client.beta.threads.runs.list(thread.id);

  const runs = runsObj.data;
  if (
    runs.some((run) =>
      ["queued", "in_progress", "cancelling"].includes(run.status)
    )
  ) {
    throw new Error("Thread is currently being processed");
  }

  const messages = await client.beta.threads.messages.list(thread.id);

  const formattedMessages = messages.data.reverse().map((message) => {
    const content = message.content[0].text.value;
    const annotations = message.content[0].text.annotations;

    return {
      role: message.role,
      content:
        annotations.length === 0
          ? content
          : content.substring(0, annotations[0].start_index) +
            content.substring(annotations[0].end_index),
    };
  });

  formattedMessages.unshift({
    role: ASSISTANT_ROLE,
    content: ASSISTANT_INITIAL_MESSAGE,
  });

  return formattedMessages;
};

export const addThreadMessage = async (threadId, content) => {
  const client = getOpenAIClient();

  // happy throwing if fails, will catch in route
  await client.beta.threads.messages.create(threadId, {
    role: USER_ROLE,
    content,
  });
};
