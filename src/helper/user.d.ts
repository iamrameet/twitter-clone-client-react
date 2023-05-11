import { User } from "./user";
import { Tweet } from "./tweet";

export type UserResponse = {
	id: number;
	name: string;
	username: string;
	createdAt: string;
  image?: string;
  cover?: string;
  bio: string;
  location: string;
  website: string;
	tweetCount: number;
	followerCount: number;
	followingCount: number;
  isFollower: boolean;
  isFollowedBy: boolean;
};

export type UserSearchResponse = {
	id: number;
	name: string;
	username: string;
	createdAt: string;
  image?: string;
  cover?: string;
  recentTweet?: { content: string };
  isFollowing: boolean;
};

export type TweetResponse = {
  id: number;
  user_id: number;
  content: string;
  created_at: number;
  retweet_of_id?: number;
  is_liked: boolean;
  is_retweeted: boolean;
  likes: number;
  replies: number;
  retweets: number;
  name: string;
  username: string;
  attachments: { id: number, url: string, type: "image" | "video"}[];
  image?: string;
};

type ReplyResponse = TweetResponse & {
  ref_id: number;
  ref_content: string;
  ref_created_at: number;
  ref_user_id: number;
  ref_user_name: string;
  ref_user_username: string;
};

export default userController;

export declare class User {
  /** @param {Partial<User>} object */
  static from(object: Partial<User>): User;
  constructor(id: number, username: string, name: string, email: string, dob: number, password: string, createdAt: number, image: string);
  id: number;
  username: string;
  name: string;
  email: string;
  dob: number;
  password: string;
  createdAt: number;
  image: string;
  tweetCount: number;
  followerCount: number;
  followingCount: number;
  isFollowedBy: boolean;
  isFollower: boolean;
  notificationsCount: number;
  isVerified: boolean;
};

declare const userController: {
  get: {
    "/"(): UserResponse;
    "/check_availability/:field/:value"(): { isAvailable: boolean };
    "/username/:username"(): UserResponse;
    "/tweets?limit&skip"(): TweetResponse[];
    "/replies?limit&skip"(): ReplyResponse[];
    "/likes?limit&skip"(): ReplyResponse[];
    "/:userId?/tweets?limit&skip"(): TweetResponse[];
    "/:userId?/replies?limit&skip"(): ReplyResponse[];
    "/:userId?/likes?limit&skip"(): (TweetResponse & ReplyResponse)[];
    "/suggestions/:query"(): User[];
    "/search?q&limit&skip"(): UserSearchResponse[];
  };
  post: {
    "/init_account"(): {
      email: any;
      key: string;
    };
    "/verify_otp"(): {};
    "/"(): {
      userData: any;
      token: any;
    };
    "/auth"(): {
      userData: UserResponse;
      token: any;
    };
    "/:userId/follow"(): {};
  };
  put: {
    "/:field"(): {
      field: "image" | "username" | "email" | "password";
      value: string;
    };
    "/update"(): { [fieldName in Exclude<keyof UserResponse, "id">]: UserResponse[fieldName] }
  };
  delete: {
    "/logout"(): boolean;
    "/:userId/unfollow"(): boolean;
  };
};