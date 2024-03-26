import fs from "fs";
import getOpenAIClient from "./getOpenAIClient.js";

const client = getOpenAIClient();
let assistant = null;

const getOrCreateAssistant = async () => {
  if (assistant !== null) {
    return assistant;
  }

  const maybeAssistant = await getAssistantIfExists();
  if (maybeAssistant) {
    assistant = maybeAssistant;
    return maybeAssistant;
  }

  assistant = await createAssistant();
  return assistant;
};

const getAssistantIfExists = async () => {
  const assistants = await client.beta.assistants.list();
  const assistant = assistants.data.find(
    (assistant) =>
      assistant.name === "Andy Reding Software Engineering Assistant"
  );

  return assistant;
};

const createAssistant = async () => {
  const file = await client.files.create({
    file: fs.createReadStream("./Reding_Andrew_Resume.pdf"),
    purpose: "assistants",
  });

  const assistant = await client.beta.assistants.create({
    instructions:
      "You are responding to questions about Andy Reding's resume. You should try to convince the user that Andy is a worth candidate for a job in software engineering. You should list multiple reasons if possible. If the input does not pertain to Andy's software engineering ability or experience, you should respond with 'I can only answer questions about Andy's software engineering ability or experience - you'll have to ask Andy directly. Please see the 'contact' section to do so.'",
    model: "gpt-3.5-turbo",
    tools: [{ type: "retrieval" }],
    file_ids: [file.id],
    name: "Andy Reding Software Engineering Assistant",
  });

  return assistant;
};

export default getOrCreateAssistant;
