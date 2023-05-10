import IconButton from "../../IconButton";
import Icon from "../../Icon";
import { Gear, MagnifyingGlass } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { getTrending } from "../../../scripts/hashtag";
import HashtagPost from "../../HashtagPost";

export default function ExploreSection(){

  const [ hashtags, setHashtags ] = useState<Awaited<ReturnType<typeof getTrending>>>([]);

  useEffect(function(){
    getTrending().then(setHashtags);
  }, []);

  return <>
    <header className="container w-fill">

      <form action="#" className="container w-fill row gap pad center">

        <div className="container input w-fill">
          <Icon><MagnifyingGlass/></Icon>
          <input type="search" placeholder="Search Twitter"/>
        </div>

        <IconButton>
          <Gear/>
        </IconButton>

      </form>

      <nav className="container w-fill row nav-bar">
        {/* <a href="#" className="container w-fill active">For You</a> */}
        <a href="#" className="container w-fill active">Trending</a>
        {/* <a href="#" className="container w-fill">News</a>
        <a href="#" className="container w-fill">Sports</a>
        <a href="#" className="container w-fill">Entertainment</a> */}
      </nav>

    </header>

    <section className="container w-fill h-fill auto">
      {
        hashtags.map(hashtag => <HashtagPost hashtag={ hashtag }/>)
      }
    </section>

  </>;
};