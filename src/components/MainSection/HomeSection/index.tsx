import { useContext, useEffect, useState } from "react";
import FetchRequest from "../../../scripts/fetch-request";
import TweetArea from "../../TweetArea";
import TweetPost, { OnlyReqUser, TweetContentProperties } from "../../TweetPost";
import { Tweet } from "../../../helper/tweet";
import { MappedTweet, getTweets, getTweetsUpdate } from "../../../scripts/tweets";
import { UserResponse } from "../../../helper/user";
import { UserContext } from "../../context/AuthUser";
import { ImageSelectProvider } from "../../TweetArea/ImageSelect";
import Tabs from "../../Tabs";

type HomeSectionProperties = {
  tweets?: MappedTweet[];
  onTweetReplyClick: TweetContentProperties["onReplyClick"];
  onOverlay?: (overlay: JSX.Element, index?: number) => number;
};

export default function HomeSection(props: HomeSectionProperties){

  const { userData } = useContext(UserContext);
  const [ tweets, setTweets ] = useState(props.tweets ?? []);

  const tabs = Tabs({
    forYou: {
      title: "For You",
      section: <ImageSelectProvider>
        <TweetArea onTweet={ addTweet } onOverlay={ props.onOverlay }/>
      </ImageSelectProvider>
    },
    following: {
      title: "Following",
      section: <>{
        tweets.map(tweet => <TweetPost
          tweet={ tweet }
          user={ tweet.user }
          onReplyClick={ props.onTweetReplyClick }
        />)
      }</>
    }
  }, { default: "following" });


  function addTweet(tweet: Tweet){
    if(userData === undefined){
      return;
    }
    tweets[0].user.image
    setTweets([{
      ...tweet,
      isLiked: tweet.isLiked ?? false,
      isRetweeted: tweet.isRetweeted ?? false,
      retweetOfId: tweet.retweetOfId ?? undefined,
      user: { ...userData, image: userData.image }
    }, ...tweets]);
  }

  useEffect(() => {
    void async function(){
      setTweets(await getTweetsUpdate({ limit: 20 }));
    }();
  }, [ tabs.selected ]);

  return <>
    <header className="container w-fill">

    <div className="container w-fill row gap pad-500 pad-h">
      <h2>Home</h2>
    </div>

    <nav className="container w-fill row nav-bar">
      { tabs.nav }
    </nav>

    </header>

    <section className={"container w-fill h-fill" + (tabs.selected === "forYou" ? " pad" : "")}>
      { tabs.section }
    </section>

  </>;
};