import IconButton from "../../IconButton";
import Icon from "../../Icon";
import { Gear, MagnifyingGlass, ArrowLeft, DotsThree, MagnifyingGlassMinus } from "@phosphor-icons/react";
import AccountPost from "../../AccountPost";
import TweetPost, { TweetContentProperties } from "../../TweetPost";
import { useEffect, useState } from "react";
import { searchUsers } from "../../../scripts/user";
import { TweetResponse, UserSearchResponse } from "../../../helper/user";
import { getTweets, searchTweets } from "../../../scripts/tweets";
import { useLocation, useNavigate } from "react-router-dom";

type SearchSectionId = "top" | "latest" | "people";
type SectionLinkProperties = {
  id: SearchSectionId;
  children: string;
  state: [SearchSectionId, React.Dispatch<React.SetStateAction<SearchSectionId>>];
};

function SectionLink(props: SectionLinkProperties){
  return <a
    href="#"
    className={ "container w-fill" + (props.state[0] === props.id ? " active" : "") }
    onClick={ () => {
      props.state[1](props.id);
    } }
  >{ props.children }</a>;
}

export default function SearchSection(props: { onTweetReplyClick: TweetContentProperties["onReplyClick"]; }){

  const navigate = useNavigate();

  const params = new URLSearchParams(useLocation().search);

  const sectionState = useState<SearchSectionId>("top");
  const [ queryType, setQueryType ] = useState(params.get("type"));
  const [ query, setQuery ] = useState(params.get("q") ?? "");
  const [ tweets, setTweets ] = useState<Awaited<ReturnType<typeof searchTweets>>>([]);
  const [ people, setPeople ] = useState<UserSearchResponse[]>([]);


  useEffect(function(){
    console.log(sectionState[0])
    searchTweets(query, {
      kind: sectionState[0] === "top" ? "top" : "latest",
      type: queryType === "hashtag" ? "hashtag" : null,
      limit: 10
    }).then(setTweets);
  }, []);

  useEffect(function(){
    setQuery(params.get("q") ?? "");
  }, [ params.get("q") ]);

  useEffect(function(){
    setQueryType(params.get("hashtag") ?? "");
  }, [ params.get("hashtag") ]);

  useEffect(function(){
    console.log(sectionState[0], queryType)
    switch(sectionState[0]){
      case "people":
        return void searchUsers(query, { limit: 10 }).then(setPeople);
      default:
        return void searchTweets(query, {
          kind: sectionState[0],
          limit: 10,
          type: queryType === "hashtag" ? "hashtag" : null,
        }).then(setTweets);
    }
  }, [ sectionState[0], query ]);

  return <>
    <header className="container w-fill">

      <form
        className="container w-fill row gap pad center"
        onSubmitCapture={
          sectionState[0] === "people" ?
            event => {
              event.preventDefault();
              searchUsers(query, { limit: 10 }).then(setPeople);
            }
          : event => {
            event.preventDefault();
            searchTweets(query, {
              kind: sectionState[0] === "top" ? "top" : "latest",
              limit: 10,
              type: queryType === "hashtag" ? "hashtag" : null
            }).then(setTweets);
          }
        }
      >

        <IconButton>
          <ArrowLeft/>
        </IconButton>

        <div className="container input w-fill">
          <Icon><MagnifyingGlass/></Icon>
          <input
            type="search"
            placeholder="Search Twitter"
            required={ true }
            value={ query }
            onInput={
              ({ currentTarget }) => {
                navigate(`/search/?q=${ currentTarget.value }`, { replace: true });
                setQuery(currentTarget.value);
              }
            }
          />
        </div>

        <IconButton>
          <DotsThree/>
        </IconButton>

      </form>

      <nav className="container w-fill row nav-bar">
        <SectionLink state={sectionState} id="top">Top</SectionLink>
        <SectionLink state={sectionState} id="latest">Latest</SectionLink>
        <SectionLink state={sectionState} id="people">People</SectionLink>
        {/* <a href="#" className="container w-fill">Photos</a>
        <a href="#" className="container w-fill">Videos</a> */}
      </nav>

    </header>

    <div className="container w-fill">
      {
        sectionState[0] === "people" ?
          <> {
            people.map(user => <AccountPost user={ user }></AccountPost>)
          } </>
        : <> {
            tweets.map((tweet, index) => {
              return <TweetPost
                key={ sectionState[0] + index }
                tweet={ tweet }
                user={ tweet.user }
                onReplyClick={ props.onTweetReplyClick }
              />;
            })
          } </>
      }
    </div>
  </>;
};