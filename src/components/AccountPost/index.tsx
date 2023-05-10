import { useState } from "react";
import { UserResponse, UserSearchResponse } from "../../helper/user";
import Button from "../Button";
import Icon from "../Icon";
import VerifiedSVG from "../VerifiedSVG";
import FetchRequest from "../../scripts/fetch-request";
import { sleep } from "../../scripts/util";

export default function AccountPost(props: { accountIsVerified?: boolean, user: UserSearchResponse }){

  const [ isFollowing, toggleFollow ] = useState(props.user.isFollowing);
  const [ followingState, setFollowingState ] = useState<"pending" | "fulfilled">("fulfilled");

  return <div className="container w-fill row pad gap hover account-post">
    <div className="container">
      <div className="box image" style={{
        backgroundImage: `url("${ props.user.image ?? "https://abs.twimg.com/sticky/default_profile_images/default_profile_bigger.png" }")`
      }}></div>
    </div>
    <div className="container w-fill">
      <div className="container w-fill row center">
        <div className="container w-fill">
          <div className="container row text title gap-250">
            { props.user.name } {
            props.accountIsVerified ? <Icon><VerifiedSVG/></Icon> : ""
          }</div>
          <div className="text sub-title">{ props.user.username }</div>
        </div>
        <Button
          emphasis={ isFollowing ? "low" : "high"}
          size="small"
          isMono={ true }
          disabled={ followingState === "pending" }
          spinner={ true }
          onClick={ async () => {
            setFollowingState("pending");
            try{
              // await sleep(1000);
              if(!isFollowing){
                const response = await FetchRequest.post("/user/:userId/follow", {}, { userId: props.user.id });
                toggleFollow(true)
              } else {
                FetchRequest.delete("/user/:userId/unfollow", { userId: props.user.id }).then(toggleFollow);
              }
            } catch(ex) {
              toggleFollow(isFollowing);
            } finally {
              setFollowingState("fulfilled");
            }
          } }
        >
        { isFollowing ? "Following" : "Follow" }
        </Button>
      </div>
      <p>{ props.user.recentTweet?.content }</p>
    </div>
  </div>;
};