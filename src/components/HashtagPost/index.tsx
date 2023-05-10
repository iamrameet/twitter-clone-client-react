import { HashtagResponse } from "../../helper/hashtag";

export default function HashtagPost(props: { hashtag: HashtagResponse }){

  return <div className="container w-fill pad hover">
    <div className="text title">#{ props.hashtag.hashtag }</div>
    <div className="text sub-title small">{ props.hashtag.count } Tweets</div>
  </div>;

}