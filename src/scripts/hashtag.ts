import FetchRequest from "./fetch-request";

export async function getTrending(){
  return await FetchRequest.get("/hashtag/trending");
}