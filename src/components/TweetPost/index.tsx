import { ChartBar, ChartLine, Chat, DotsThree, Heart, Repeat, TextAlignRight, UploadSimple } from "@phosphor-icons/react";
import Icon from "../Icon";
import IconButton from "../IconButton";
import VerifiedSVG from "../VerifiedSVG";
import ActionButton from "../Button/ActionButton";
import "./Style.css";

import { User } from "../../helper/user";
import UserController from "../../helper/user";
import FetchRequest from "../../scripts/fetch-request";
import { useContext, useReducer, useState } from "react";
import { Tweet } from "../../helper/tweet";
import { timeElapsed } from "../../scripts/helper";
import { TweetReply, getReplies } from "../../scripts/tweets";
import { NavLink } from "react-router-dom";
import { OverlayContext } from "../DialogBox";
import Menu from "../Menu";

type OnlyReqUser = {
  id: User["id"];
  name: User["name"];
  username: User["username"];
  image?: User["image"];
  isVerified?: User["isVerified"];
  isFollowing: boolean;
  isFollower: boolean;
  followerCount: number;
  followingCount: number;
  tweetCount: number;
};

export type TweetPostUser = {
  id: OnlyReqUser["id"],
  name: OnlyReqUser["name"],
  username: OnlyReqUser["username"],
  image?: OnlyReqUser["image"],
  isVerified?: OnlyReqUser["isVerified"]
};

type TweetContentProperties = {
  tweet: Tweet;
  user: TweetPostUser;
  refTweet?: TweetReply["ref"];
  onReplyClick: (user: TweetPostUser, tweet: Tweet) => void;
};

export type { OnlyReqUser, TweetContentProperties };

export default function TweetPost(props: TweetContentProperties){

  const [ liked, toggleLike ] = useState(props.tweet.isLiked);
  const [ likes, setLikes ] = useState(props.tweet.likes);
  const [ retweeted, toggleRetweet ] = useState(props.tweet.isRetweeted);
  const [ retweets, setRetweets ] = useState(props.tweet.retweets);

  const { openHandle, closeHandle } = useContext(OverlayContext);

  const tweetContent: (string | JSX.Element)[] = [];

  const matchArray = Array.from(props.tweet.content.matchAll(/(#|@)\w+/g));
  let index = 0;
  let count = 0;
  for(const hashtag of matchArray){
    const hashtagIndex = hashtag.index ?? 0;
    const beforeString = props.tweet.content.substring(index, hashtagIndex);
    const hashtagString = props.tweet.content.substring(hashtagIndex, hashtagIndex + hashtag[0].length);
    tweetContent.push(beforeString, <NavLink
      key={ count++ }
      className="link"
      to={ (hashtag[0][0] === "#" ? "/search?type=hashtag&q=" : "/") + hashtagString.substring(1) }
    >{ hashtagString }</NavLink>);
    index = hashtagIndex + hashtag[0].length;
  }
  tweetContent.push(props.tweet.content.substring(index));

  return <div className="container w-fill row gap hover tweet-post">

    <div className="container">
      {
        props.tweet.isRetweeted ?
          <div className="container w-fill end text mid small top-info">
            <Icon><Repeat weight="bold"/></Icon>
          </div>
        : <></>
      }
      <div className="box image" style={{
        backgroundImage: `url("${ props.user.image ?? "https://abs.twimg.com/sticky/default_profile_images/default_profile_bigger.png" }")`
      }}></div>
    </div>

    <div className="container content-area">
      {
        props.tweet.isRetweeted ?
          <div className="container w-fill text mid small semi-bold top-info">Retweeted</div>
        : <></>
      }
      <div className="container w-fill row center">
        <div className="container w-fill row gap-500 text-line">
          <div className="container row text title gap-250 ellipsis">{ props.user.name } {
            props.user.isVerified ? <Icon><VerifiedSVG/></Icon> : ""
          }</div>
          <span className="text sub-title ellipsis">{ props.user.username }</span>
          <span className="text sub-title">· { timeElapsed(props.tweet.createdAt) }</span>
        </div>
      </div>

      <div className="content">
        {
          props.refTweet ?
            <p className="container row gap-500 text sub-title">
              Replying to
              <NavLink
                to={ "/" + props.refTweet.user.username }
                className="link"
              >@{ props.refTweet.user.username }</NavLink>
            </p>
          : ""
        }
        { tweetContent }
        {
          props.tweet.attachments.map(attachment => <img
            src={ "https://twitter-clone-excs.onrender.com/" + attachment.url }
            alt=""
            className="container media"
          />)
        }
      </div>

      <div className="container w-fill row gap between actions">

        <ActionButton
          text={ props.tweet.replies || "" }
          title="Reply"
          onClick={ () => props.onReplyClick(props.user, props.tweet) }
        ><Chat weight="bold"/></ActionButton>

        <ActionButton
          accent="green"
          text={ retweets > 0 ? retweets : undefined }
          colored={ retweeted }
          title={ retweeted ? "Undo retweet" : "Retweet" }
          onClick={ async () => {
            toggleRetweet(!retweeted);
            try {
              if(!retweeted){
                const retweet = await FetchRequest.post("/tweet/:tweetId/retweet", {}, {
                  tweetId: props.tweet.retweetOfId ?? props.tweet.id
                });
                setRetweets(retweets + 1);
                return toggleRetweet(true);
              }
              const undo_retweet = await FetchRequest.delete("/tweet/:tweetId/undo_retweet", {
                tweetId: props.tweet.retweetOfId ?? props.tweet.id
              });
              setRetweets(retweets - 1);
              toggleRetweet(false);
            } catch (ex) {
              toggleRetweet(!retweeted);
              console.log(ex);
            }
          } }
        ><Repeat weight="bold"/></ActionButton>

        <ActionButton
          accent="pink"
          text={ likes > 0 ? likes : undefined }
          colored={ liked }
          title={ liked ? "Unlike" : "Like" }
          onClick={ async () => {
            toggleLike(!liked);
            try {
              if(!liked){
                const tweet_like = await FetchRequest.post("/tweet/:tweetId/like", {}, {
                  tweetId: props.tweet.id
                });
                setLikes(likes + 1);
                return toggleLike(true);
              }
              const unliked = await FetchRequest.delete("/tweet/:tweetId/unlike", {
                tweetId: props.tweet.id
              });
              setLikes(likes - 1);
              toggleLike(false);
            } catch (ex) {
              toggleLike(!liked);
              console.log(ex);
            }
          } }
        ><Heart weight={ liked ? "fill" : "bold" }/></ActionButton>

        {/* <ActionButton width="w-fill" text="81" title="Views"><ChartLine weight="bold"/></ActionButton> */}
        {/* <ActionButton width="w-fill" title="Share"><UploadSimple weight="bold"/></ActionButton> */}
      </div>

    </div>

    <div className="container">
      <IconButton onClick={
        ({ clientX, clientY }) => void openHandle(
          <Menu
            items={{
              remove: {
                text: "Delete",
                emphasis: "danger",
                async onClick(){
                  // await FetchRequest.delete("/tweet/:tweetId");
                }
              },
              bookmark: {
                text: "Bookmark",
                async onClick(){
                }
              }
            }}
            left={ clientX - 160 }
            top={ clientY }
          ></Menu>
        )
      }>
        <DotsThree/>
      </IconButton>
    </div>

  </div>;
};