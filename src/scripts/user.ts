import { User, UserResponse } from "../helper/user";
import FetchRequest from "./fetch-request";

export const DEFAULT_IMAGE = "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png";

export async function getUser(username: string){
  const user = await FetchRequest.get("/user/username/:username", { username });
  user.image = user.image ? FetchRequest.host + user.image.replaceAll("\\","/") : DEFAULT_IMAGE;
  user.cover = user.cover ? FetchRequest.host + user.cover.replaceAll("\\","/") : undefined;
  return user;
}

export async function searchUsers(q: string, options: { limit: number, skip?: number }){
  const users = await FetchRequest.get("/user/search?q&limit&skip", {}, {
    q,
    limit: options.limit,
    skip: options.skip ?? 0
  });
  users.forEach(user => {
    user.image = user.image ? FetchRequest.host + user.image.replaceAll("\\","/") : DEFAULT_IMAGE;
    user.cover = user.cover ? FetchRequest.host + user.cover.replaceAll("\\","/") : undefined;
  });
  return users;
}

type ProfileUpdateFields = {
  name: string;
  bio: string;
  location: string;
  website: string;
  image?: File;
  cover?: File;
};

export async function updateUser(fields: ProfileUpdateFields){
  const formData = new FormData();
  Object.entries(fields).forEach(entry => formData.set(...entry));
  const update = await FetchRequest.putFormData("/user/update", formData);
  if(update.image)
    update.image = FetchRequest.host + update.image.replaceAll("\\","/");
  if(update.cover)
    update.cover = FetchRequest.host + update.cover.replaceAll("\\","/");
  return update;
}