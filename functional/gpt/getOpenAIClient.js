import OpenAI from "openai";

let client = null;

const getOpenAIClient = () => {
  if (client !== null) {
    return client;
  }

  client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  return client;
};

export default getOpenAIClient;
