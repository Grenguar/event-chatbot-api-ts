export interface ITextMessageReply {
  replies: IMessageContent[];
}

export interface IMessageContent {
  type: string;
  content: string;
}
