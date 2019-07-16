import AWS from "aws-sdk";
import { Request } from "recastai";
import ILambdaResponse from "./domain/ILambdaResponse";
import Translator from "./translator";

const RECAST_TOKEN = process.env.recast_token || "empty";

export default class ChatBotReply {
  private originalMessage: string;

  constructor(originalMessage: string) {
    this.originalMessage = originalMessage;
  }

  public async send(): Promise<ILambdaResponse> {
    const translator: Translator = new Translator();
    const translatedMessageObj = await translator.translateMessage(this.originalMessage, "auto", "en");
    const originalMsgLanguage: string = translatedMessageObj.SourceLanguageCode;
    const recastRequest = new Request(RECAST_TOKEN, originalMsgLanguage);
    const analysedText = await recastRequest.analyseText(translatedMessageObj.TranslatedText);

    return {
      statusCode: 200,
      body: "Succeeded"
    };
  }
}
