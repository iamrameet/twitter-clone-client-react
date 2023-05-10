import { NotificationTypeContentMap, NotificationSchema } from "../helper/schema";

export declare type NotificationResponse = NotificationSchema<"follow"> | NotificationSchema<"like"> | NotificationSchema<"reply"> |  NotificationSchema<"retweet"> | NotificationSchema<"mention"> | NotificationSchema<"login">;

declare const hashtagController: {
  get: {
    "/"(): NotificationResponse[];
  };
};

export default hashtagController;