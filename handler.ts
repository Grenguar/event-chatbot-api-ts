import { Handler, Context, Callback } from "aws-lambda";
import Translator from "./src/translator";

export const send: Handler = async (event: any, context: Context, callback: Callback) => {
  console.log("Sending reply to bot lambda function started");
  const translator: Translator = new Translator();
  const text = await translator.translateMessage("I am from Russia", "en", "fi");
  console.log(text);
  callback(null, {
    statusCode: 200,
    headers: "application/json",
    body: text.TranslatedText
  });
};
