import { ArrowLeft, Calendar, LinkSimple, MapPin } from "@phosphor-icons/react";
import IconButton from "../../IconButton";
import TweetArea from "../../TweetArea";
import "./Style.css";
import Button from "../../Button";
import VerifiedSVG from "../../VerifiedSVG";
import Icon from "../../Icon";
import { useContext, useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Tweet } from "../../../helper/tweet";
import TweetPost, { OnlyReqUser, TweetContentProperties } from "../../TweetPost";
import { MappedTweet, getLikes, getReplies, getTweets } from "../../../scripts/tweets";
import { getUser, updateUser } from "../../../scripts/user";
import { UserResponse } from "../../../helper/user";
import { sleep } from "../../../scripts/util";
import { UserContext } from "../../context/AuthUser";
import { PaginatorContext } from "../../Paginator";
import FetchRequest from "../../../scripts/fetch-request";
import DialogBox, { OverlayContext } from "../../DialogBox";
import Input, { FileInput } from "../../Input";
import { EditProfileDialog } from "./EditProfileDialog";


type UserPSProperties = {
  onTweetReplyClick: TweetContentProperties["onReplyClick"];
};

type Properties = {
  tweets?: MappedTweet[];
} & UserPSProperties;

type SectionId = "tweets" | "replies" | "media" | "likes";

type NavLinkProperties = {
  children: string;
  id: SectionId;
  state: [SectionId, React.Dispatch<React.SetStateAction<SectionId>>]
};

function NavLink(props: NavLinkProperties){
  return <a
    href="#"
    className={ `container w-fill${ props.id === props.state[0] ? " active" : "" }` }
    onClick={ () => props.state[1](props.id) }
  >{ props.children }</a>
}

export default function ProfileSection(props: Properties){

  const { userData } = useContext(UserContext);
  const overlay = useContext(OverlayContext);
  const { limit = 10, skip = 0, resolved, setResolver } = useContext(PaginatorContext);
  console.log({ limit, skip, resolved })

  const [ tweets, setTweets ] = useState(props.tweets ?? []);
  const [ replies, setReplies ] = useState<Awaited<ReturnType<typeof getReplies>>>([]);
  const [ likes, setLikes ] = useState<Awaited<ReturnType<typeof getLikes>>>([]);

  const [ shouldRenderSpinner, setSpinner ] = useState(true);
  const spinner = <div className="container w-fill h-fill center">
    <div className="spinner"></div>
  </div>;
  const sectionState = useState<SectionId>("tweets");


  useEffect(() => {
    if(userData === undefined){
      return;
    }
    setSpinner(true);
    sleep(1000).then(function(){

      switch(sectionState[0]){

        case "replies": void async function(){
          setReplies(await getReplies(userData.id, 10));
        }();
        setResolver(async (limit, skip) => {
          const response = await getReplies(userData.id, limit, skip);
          setReplies(response);
          return true;
        });
        break;

        case "likes": void async function(){
          setLikes(await getLikes(userData.id, 10));
        }();
        break;

        default: void async function(){
          setTweets(await getTweets(userData.id, 10));
        }();

      }
      setSpinner(false);

    });

  }, [ sectionState[0] ]);

  return userData ? <>
    <header className="container w-fill row profile-header">

      <IconButton>
        <ArrowLeft/>
      </IconButton>
      <div>
        <h2>{ userData.name }</h2>
        <p>
        {
          sectionState[0] === "replies" ? (replies.length + " Replies")
          : sectionState[0] === "likes" ? (likes.length + " Likes")
          : (userData.tweetCount + " Tweets")
        }
        </p>
      </div>

    </header>

    <div className="container w-fill profile-details">

      <div className="container w-fill cover" style={{ backgroundImage: `url("${ userData.cover }")` }}></div>
      <div className="container row pad">
        <img className="container image" src={ userData.image }/>
        <div className="container buttons">
          <Button
            emphasis="low"
            isMono={ true }
            onClick={
              () => {
                overlay.openHandle(<EditProfileDialog closeHandle={ overlay.closeHandle }/>);
              }
            }
          >Edit Profile</Button>
        </div>
      </div>

      <div className="container pad">
        <h2 className="container row gap-500">
          { userData.name }
          <Icon><VerifiedSVG/></Icon>
        </h2>
        <p className="text sub-title">@{ userData.username }</p>

        <br/>

        {
          userData.bio ?
            <div className="container row gap-500">{ userData.bio }</div>
          : <></>
        }

        <br/>

        <div className="container row gap-500 text sub-title">
        {
          userData.location ?
            <div className="container row gap-100">
              <Icon><MapPin/></Icon>
              <span>{ userData.location }</span>
            </div>
          : <></>
        }
        {
          userData.website ?
            <div className="container row gap-100">
              <Icon><LinkSimple/></Icon>
              <a href={ userData.website } className="link">{ userData.website }</a>
            </div>
          : <></>
        }
          <div className="container row gap-100">
            <Icon><Calendar/></Icon>
            <span>Joined {
              (() => {
                const date = new Date(userData.createdAt);
                return date.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
              })()
            }</span>
          </div>

        </div>


        <br/>
        <div className="container row gap">
          <p> <b>{ userData.followerCount }</b> <span className="text sub-title">Followers</span> </p>
          <p> <b>{ userData.followingCount }</b> <span className="text sub-title">Following</span> </p>
        </div>
        <br/>
        <p className="text sub-title">Not followed by anyone you’re following</p>
        <br/>
        <nav className="container w-fill row nav-bar">
          <NavLink id="tweets" state={ sectionState }>Tweets</NavLink>
          <NavLink id="replies" state={ sectionState }>Replies</NavLink>
          <NavLink id="media" state={ sectionState }>Media</NavLink>
          <NavLink id="likes" state={ sectionState }>Likes</NavLink>
        </nav>
      </div>

    </div>

    <section className="container w-fill profile-content">
      {
        shouldRenderSpinner ? spinner
        : sectionState[0] === "tweets" ? tweets.map(tweet => <TweetPost
          key={ sectionState[0] + "-" + tweet.id }
          tweet={ tweet }
          user={ tweet.user }
          onReplyClick={ props.onTweetReplyClick }
        />)
        : sectionState[0] === "replies" ? replies.map(tweet => <TweetPost
          key={ sectionState[0] + "-" + tweet.id }
          refTweet={ tweet.ref }
          tweet={ tweet }
          user={ tweet.user }
          onReplyClick={ props.onTweetReplyClick }
        />)
        : sectionState[0] === "likes" ?
          likes.length === 0 ?
          <>
            <h2>You don’t have any likes yet</h2>
            <p>Tap the heart on any Tweet to show it some love. When you do, it’ll show up here.</p>
          </>
          : likes.map(tweet => <TweetPost
            key={ sectionState[0] + "-" + tweet.id }
            refTweet={ tweet.ref ?? undefined }
            tweet={ tweet }
            user={ tweet.user }
            onReplyClick={ props.onTweetReplyClick }
          />)
        : []
      }
    </section>

  </> : <div className="container w-fill h-fill">User not found</div>;
};

export function UserProfileSection(props: UserPSProperties){

  const { username } = useParams<"username">();

  const [ user, setUser ] = useState<Awaited<ReturnType<typeof getUser>>>();
  const [ isFollowedBy, toggleFollow ] = useState(user?.isFollowedBy ?? false);
  const [ tweets, setTweets ] = useState<Awaited<ReturnType<typeof getTweets>>>([]);
  const [ replies, setReplies ] = useState<Awaited<ReturnType<typeof getReplies>>>([]);
  const [ likes, setLikes ] = useState<Awaited<ReturnType<typeof getLikes>>>([]);

  const [ shouldRenderSpinner, setSpinner ] = useState(true);
  const spinner = <div className="container w-fill h-fill center">
    <div className="spinner"></div>
  </div>;

  const sectionState = useState<SectionId>("tweets");


  useEffect(() => {
    void async function(){
      if(username){
        const user = await getUser(username);
        console.log({ user });
        setUser(user);
        toggleFollow(user.isFollowedBy);
      }
    }();
  }, [  ]);

  useEffect(() => {
    if(user === undefined){
      return;
    }
    setSpinner(true);
    sleep(1000).then(function(){

      switch(sectionState[0]){

        case "replies": void async function(){
          setReplies(await getReplies(user.id, 10));
        }();
        break;

        case "likes": void async function(){
          setLikes(await getLikes(user.id, 10));
        }();
        break;

        default: void async function(){
          setTweets(await getTweets(user.id, 10));
        }();

      }
      setSpinner(false);

    });

  }, [ sectionState[0] ]);

  if(user === undefined){
    return spinner;
  }

  return <>
    <header className="container w-fill row profile-header">

      <Link to="/">
        <IconButton>
          <ArrowLeft/>
        </IconButton>
      </Link>
      <div>
        <h2>{ user.name }</h2>
        <p>
        {
          sectionState[0] === "replies" ? (replies.length + " Replies")
          : sectionState[0] === "likes" ? (likes.length + " Likes")
          : (user.tweetCount + " Tweets")
        }
        </p>
      </div>

    </header>

    <div className="container w-fill profile-details">

      <div className="container w-fill cover"></div>
      <div className="container row pad">
        <img className="container image" src={ user.image ?? "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"}/>
        <div className="container buttons">
            <Button
              emphasis={ isFollowedBy ? "medium" : "high" }
              onClick={
                isFollowedBy ?
                  async () => {
                    toggleFollow(false);
                    try{
                      await FetchRequest.delete("/user/:userId/unfollow", { userId: user.id });
                    } catch(ex){}
                  }
                : async () => {
                    toggleFollow(true);
                    try{
                      await FetchRequest.post("/user/:userId/follow", {}, { userId: user.id });
                    } catch(ex) {}
                  }
              }
            >
              { isFollowedBy ? "Unfollow" : user.isFollower ? "Follow back" : "Follow" }
            </Button>
        </div>
      </div>

      <div className="container pad">
        <h2 className="container row gap-500">
          { user.name }
          <Icon><VerifiedSVG/></Icon>
        </h2>
        <p className="text sub-title">@{ user.username }</p>
        <br/>
        <div className="container row gap">
          <p> <b>{ user.followerCount }</b> <span className="text sub-title">Followers</span> </p>
          <p> <b>{ user.followingCount }</b> <span className="text sub-title">Following</span> </p>
        </div>
        <br/>
        <p className="text sub-title">Not followed by anyone you’re following</p>
        <br/>
        <nav className="container w-fill row nav-bar">
          <NavLink id="tweets" state={ sectionState }>Tweets</NavLink>
          <NavLink id="replies" state={ sectionState }>Replies</NavLink>
          <NavLink id="media" state={ sectionState }>Media</NavLink>
          <NavLink id="likes" state={ sectionState }>Likes</NavLink>
        </nav>
      </div>

    </div>

    <section className="container w-fill h-fill profile-content">
      {
        shouldRenderSpinner ? spinner
        : sectionState[0] === "tweets" ? tweets.map(tweet => <TweetPost
          tweet={ tweet }
          user={ tweet.user }
          onReplyClick={ props.onTweetReplyClick }
        />)
        : sectionState[0] === "replies" ? replies.map(tweet => <TweetPost
          refTweet={ tweet.ref }
          tweet={ tweet }
          user={ tweet.user }
          onReplyClick={ props.onTweetReplyClick }
        />)
        : sectionState[0] === "likes" ?
          likes.length === 0 ?
            <div className="container zero-results">
              <h1>@{ user.username } hasn’t liked any Tweets</h1>
              <p>When they do, those Tweets will show up here.</p>
            </div>
          : likes.map(tweet => <TweetPost
            refTweet={ tweet.ref }
            tweet={ tweet }
            user={ tweet.user }
            onReplyClick={ props.onTweetReplyClick }
          />)
        : []
      }
    </section>

  </>;
};