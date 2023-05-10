import { TweetResponse } from "./user";

export declare class Tweet {
  static from(object: Partial<Tweet>): Tweet;
  constructor(id: number, userId: number, content: string, createdAt: number);
  id: number;
  userId?: number;
  content: string;
  createdAt: number;
  retweetOfId?: number;
  likes: number;
  isLiked?: boolean;
  replies: number;
  retweets: number;
  isRetweeted?: boolean;
  attachments: TweetResponse["attachments"];
};

export default tweetController;
declare const tweetController: {
  get: {
    "/search?q&kind&limit&skip&type"(): TweetResponse[];
    "/users?limit&skip"(): TweetResponse[];
  };
  post: {
    "/"(): {
      id: number;
      userId: number;
      content: string;
      createdAt: number;
      refId?: number;
    };
    "/:tweetId/like"(): { id: number, user_id: number, tweet_id: number, created_at: number };
    "/:tweetId/retweet"(): { id: number, user_id: number, tweet_id: number, created_at: number };
  };
  put: never;
  delete: {
    "/:tweetId/unlike"(): boolean;
    "/:tweetId/undo_retweet"(): boolean;
  };
};
