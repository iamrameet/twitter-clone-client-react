import { NavLink } from "react-router-dom";
import { HashtagResponse } from "../../helper/hashtag";

export default function HashtagPost(props: { hashtag: HashtagResponse }){

  return <NavLink
    to={ "/search?type=hashtag&q=" + props.hashtag.hashtag }
    className="container w-fill pad hover link-parent"
  >
    <div className="text title link">#{ props.hashtag.hashtag }</div>
    <div className="text sub-title small">{ props.hashtag.count } Tweets</div>
  </NavLink>;

}