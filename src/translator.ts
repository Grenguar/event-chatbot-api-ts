import AWS from "aws-sdk";
import { TranslateTextRequest } from "aws-sdk/clients/translate";

const translate = new AWS.Translate();

export default class Translator {

  public translateMessage(message: string, sourceLang: string, targetLang: string): Promise<any> {
    return (new Promise((resolve, reject) => {
      const params: TranslateTextRequest = {
        Text: message,
        SourceLanguageCode: sourceLang,
        TargetLanguageCode: targetLang
      };
      translate.translateText(params, (err, data) => {
        if (err) {
          console.log(err, err.stack);
          reject(err);
        } else {
          resolve(data);
        }
      });
    })
  }
}
