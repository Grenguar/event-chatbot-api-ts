import { Handler, Context, Callback } from "aws-lambda";
import ChatBotReply from "./src/chatBotReply";

export const send: Handler = async (event: any, context: Context, callback: Callback) => {
  const originalMessage = event.body.nlp.source;
  const chatBotReply: ChatBotReply = new ChatBotReply(originalMessage);
  await chatBotReply.send();

  callback(null, {
    statusCode: 200,
    headers: "application/json",
    body: "success"
  });
};
