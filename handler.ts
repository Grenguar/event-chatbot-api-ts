import { Handler, Context, Callback } from "aws-lambda";
import Translator from "./src/translator";

export const send: Handler = async (event: any, context: Context, callback: Callback) => {
  console.log("Sending reply to bot lambda function started");

  callback(null, {
    statusCode: 200,
    headers: "application/json",
    body: "success"
  });
};
