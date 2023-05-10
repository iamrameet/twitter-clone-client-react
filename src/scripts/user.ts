import { UserResponse } from "../helper/user";
import FetchRequest from "./fetch-request";

export async function getUser(username: string){
  const user = await FetchRequest.get("/user/username/:username", { username });
  return user;
}

export async function searchUsers(q: string, options: { limit: number, skip?: number }){
  const users = await FetchRequest.get("/user/search?q&limit&skip", {}, {
    q,
    limit: options.limit,
    skip: options.skip ?? 0
  });
  return users;
}