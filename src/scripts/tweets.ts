import FetchRequest from "./fetch-request";
import { DEFAULT_IMAGE } from "./user";
import { sleep } from "./util";

export type MappedTweet = Awaited<ReturnType<typeof getTweets>>[number];

export async function getTweets(userId: number, limit: number, skip: number = 0) {
  const tweets = await FetchRequest.get("/user/:userId?/tweets?limit&skip", { userId }, { limit, skip });

  return tweets.map(tweet => {

    return {
      id: tweet.id,
      content: tweet.content,
      createdAt: tweet.created_at,
      likes: tweet.likes,
      isLiked: tweet.is_liked,
      replies: tweet.replies,
      retweets: tweet.retweets,
      isRetweeted: tweet.is_retweeted,
      retweetOfId: tweet.retweet_of_id,
      attachments: tweet.attachments,
      user: {
        id: tweet.user_id,
        name: tweet.name,
        username: tweet.username,
        image: tweet.image ? FetchRequest.host + tweet.image.replaceAll("\\", "/") : DEFAULT_IMAGE
      }
    };

  });
};

export type TweetReply = Awaited<ReturnType<typeof getReplies>>[number];

export async function getReplies(userId: number, limit: number, skip: number = 0) {
  const tweets = await FetchRequest.get("/user/:userId?/replies?limit&skip", { userId }, { limit, skip });

  return tweets.map(tweet => {

    return {
      id: tweet.id,
      content: tweet.content,
      createdAt: tweet.created_at,
      likes: tweet.likes,
      isLiked: tweet.is_liked,
      replies: tweet.replies,
      retweets: tweet.retweets,
      isRetweeted: tweet.is_retweeted,
      retweetOfId: tweet.retweet_of_id,
      attachments: tweet.attachments,
      user: {
        id: tweet.user_id,
        name: tweet.name,
        username: tweet.username,
        image: tweet.image ? FetchRequest.host + tweet.image.replaceAll("\\", "/") : DEFAULT_IMAGE
      },
      ref: {
        id: tweet.ref_id,
        content: tweet.ref_content,
        createdAt: tweet.ref_created_at,
        user: {
          id: tweet.ref_user_id,
          name: tweet.ref_user_name,
          username: tweet.ref_user_username
        }
      }
    };

  });
};


export async function getLikes(userId: number, limit: number, skip: number = 0) {
  const tweets = await FetchRequest.get("/user/:userId?/likes?limit&skip", { userId });console.log({tweets})

  return tweets.map(tweet => {

    return {
      id: tweet.id,
      content: tweet.content,
      createdAt: tweet.created_at,
      likes: tweet.likes,
      isLiked: tweet.is_liked,
      replies: tweet.replies,
      retweets: tweet.retweets,
      isRetweeted: tweet.is_retweeted,
      attachments: tweet.attachments,
      user: {
        id: tweet.user_id,
        name: tweet.name,
        username: tweet.username,
        image: tweet.image ? FetchRequest.host + tweet.image.replaceAll("\\", "/") : DEFAULT_IMAGE
      },
      ref: tweet.ref_id ? {
        id: tweet.ref_id,
        content: tweet.ref_content,
        createdAt: tweet.ref_created_at,
        user: {
          id: tweet.ref_user_id,
          name: tweet.ref_user_name,
          username: tweet.ref_user_username
        }
      } : undefined
    };

  });
};

type TweetSearchOptions = {
  kind: "top" | "latest";
  limit: number;
  skip?: number;
  type?: "hashtag" | null;
};

export async function searchTweets(q: string, options: TweetSearchOptions){
  const tweets = await FetchRequest.get("/tweet/search?q&kind&limit&skip&type", {}, {
    q,
    kind: options.kind,
    limit: options.limit,
    skip: options.skip ?? 0,
    type: options.type ?? ""
  });
  return tweets.map(tweet => {
    return {
      id: tweet.id,
      content: tweet.content,
      createdAt: tweet.created_at,
      likes: tweet.likes,
      isLiked: tweet.is_liked,
      replies: tweet.replies,
      retweets: tweet.retweets,
      isRetweeted: tweet.is_retweeted,
      retweetOfId: tweet.retweet_of_id,
      attachments: tweet.attachments,
      user: {
        id: tweet.user_id,
        name: tweet.name,
        username: tweet.username,
        image: tweet.image ? FetchRequest.host + tweet.image.replaceAll("\\", "/") : DEFAULT_IMAGE
      }
    };
  });

};

export async function getTweetsUpdate(options: { limit: number; skip?: number; }){

  const tweets = await FetchRequest.get("/tweet/users?limit&skip", {}, {
    limit: options.limit,
    skip: options.skip ?? 0
  });
  return tweets.map(tweet => {
    return {
      id: tweet.id,
      content: tweet.content,
      createdAt: tweet.created_at,
      likes: tweet.likes,
      isLiked: tweet.is_liked,
      replies: tweet.replies,
      retweets: tweet.retweets,
      isRetweeted: tweet.is_retweeted,
      retweetOfId: tweet.retweet_of_id,
      attachments: tweet.attachments,
      user: {
        id: tweet.user_id,
        name: tweet.name,
        username: tweet.username,
        image: tweet.image ? FetchRequest.host + tweet.image.replaceAll("\\", "/") : DEFAULT_IMAGE
      }
    };
  });

};