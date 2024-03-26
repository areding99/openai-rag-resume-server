import getOpenAIClient from "./getOpenAIClient.js";
import getOrCreateAssistant from "./getOrCreateAssistant.js";

const runAssistantOnThread = async () => {
  const client = getOpenAIClient();

  const assistant = await getOrCreateAssistant();
  const thread = await client.beta.threads.create({
    messages: [
      {
        role: "user",
        content: "How would Andy do as a senior software engineer?",
      },
    ],
  });

  let run = await client.beta.threads.runs.create(thread.id, {
    assistant_id: assistant.id,
  });

  while (["queued", "in_progress", "cancelling"].includes(run.status)) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    run = await client.beta.threads.runs.retrieve(run.thread_id, run.id);
  }

  if (run.status === "completed") {
    const messages = await client.beta.threads.messages.list(run.thread_id);
    console.log(thread.id);
    for (const message of messages.data.reverse()) {
      console.log(`${message.role} > ${message.content[0].text.value}`);
    }
  } else {
    console.log(run.status);
  }
};

export default runAssistantOnThread;
