import { Handler, Context, Callback } from "aws-lambda";

export const send: Handler = (event: any, context: Context, callback: Callback) => {
  console.log("Sending reply to bot lambda function started");
  callback(null, {
    statusCode: 200,
    headers: "application/json",
    body: JSON.stringify(event)
  });
};
