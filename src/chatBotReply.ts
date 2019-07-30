import AWS from "aws-sdk";
import { Request, Response } from "recastai";
import Translator from "./translator";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { ITextMessageReply, IMessageContent } from "./domain/ITextMessageReply";

const RECAST_TOKEN = process.env.recast_token || "empty";
const docClient = new AWS.DynamoDB.DocumentClient();

export default class ChatBotReply {
  private originalMessage: string;

  constructor(originalMessage: string) {
    this.originalMessage = originalMessage;
  }

  public async send(): Promise<ITextMessageReply> {
    const translator: Translator = new Translator();
    const translatedMessageObj = await translator.translateMessage(this.originalMessage, "auto", "en");
    const originalMsgLanguage: string = translatedMessageObj.SourceLanguageCode;
    const recastRequest = new Request(RECAST_TOKEN, originalMsgLanguage);
    const analysedText: Response = await recastRequest.analyseText(translatedMessageObj.TranslatedText);
    // const intentFromtranslatedMessage = await this.getIntentFromEngMessage(analysedText);
    // const responseFromDb = await this.getTranslatedAnswerToUser(intentFromtranslatedMessage, originalMsgLanguage);
    const messageContent: IMessageContent = {
      type: "text",
      content: JSON.stringify(analysedText)
    };
    // return {
    //   replies: [messageContent]
    // };
    return {
      replies: [messageContent]
    };
  }

  private getTranslatedAnswerToUser(intent: string, language: string): Promise<any> {
    const fallbackLanguage = "en";
    const supportedLanguage = this.supportedLanguageByDb(language);
    const languageToQueryFromDb = supportedLanguage ? language : fallbackLanguage;
    const projectExpressionFormation = `#int, ${languageToQueryFromDb}`;
    const params: DocumentClient.QueryInput = {
      TableName: process.env.TABLE_NAME || "empty",
      KeyConditionExpression: "#int = :intent",
      ProjectionExpression: projectExpressionFormation,
      ExpressionAttributeNames: {
        "#int": "intent"
      },
      ExpressionAttributeValues: {
        ":intent": intent
      }
    };
    const dbResponse = new Promise((resolve, reject) => {
      docClient.query(params, (err, data: DocumentClient.QueryOutput) => {
        if (err) {
          console.log("Unable to query. Error:", JSON.stringify(err, null, 2));
          reject(err);
        } else {
          const responseFromDb = data.Items[0];
          resolve(responseFromDb[languageToQueryFromDb]);
        }
      });
    });
    return dbResponse;
  }

  private supportedLanguageByDb(language: string): boolean {
    return language === "en" || language === "sv" || language === "ru" || language === "fi";
  }

  private getIntentFromEngMessage(message: Response): string {
    const response = message.raw;
    const intentsArray = response.intents;
    if (intentsArray.length === 0) {
      return "repeat";
    } else {
      intentsArray.sort((i1: any, i2: any) => i2.confidence - i1.confidence);
      if (intentsArray[0].slug === "start") {
        return "demo";
      }
      return intentsArray[0].slug;
    }
  }
}
