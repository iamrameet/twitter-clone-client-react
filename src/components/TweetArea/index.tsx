import { Calendar, CalendarCheck, Gif, Globe, Image, ListNumbers, MapPin, Smiley } from "@phosphor-icons/react";
import Button from "../Button";
import "./Style.css";
import IconButton from "../IconButton";
import { useContext, useEffect, useRef, useState } from "react";
import { clamp } from "../../scripts/util";
import FetchRequest from "../../scripts/fetch-request";
import { Tweet } from "../../helper/tweet";
import UserSelect from "../UserSelect";
import { User } from "../../helper/user";
import Icon from "../Icon";
import VerifiedSVG from "../VerifiedSVG";
import { timeElapsed } from "../../scripts/helper";
import { OnlyReqUser, TweetPostUser } from "../TweetPost";
import ImageSelect, { ImageSelectContext, ImageSelectProvider } from "./ImageSelect";
import { CompositeDecorator, ContentBlock, ContentState, Editor, EditorState, Modifier, SelectionState } from "draft-js";

type TweetAreaProperties = {
  tweetRef?: { tweet: Tweet, user: TweetPostUser };
  onTweet?: (tweet: Tweet) => void;
  onOverlay?: (overlay: JSX.Element, index?: number) => number;
  onOverlayRemove?: (index: number) => void;
};
// Note: these aren't very good regexes, don't use them!
const HANDLE_REGEX = /\@[\w]+/g;
const HASHTAG_REGEX = /\#[\w\u0590-\u05ff]+/g;

function handleStrategy(contentBlock: ContentBlock, callback: (start: number, end: number) => void, contentState: ContentState) {
  findWithRegex(HANDLE_REGEX, contentBlock, callback);
}

function hashtagStrategy(contentBlock: ContentBlock, callback: (start: number, end: number) => void, contentState: ContentState) {
  findWithRegex(HASHTAG_REGEX, contentBlock, callback);
}

function findWithRegex(regex: RegExp, contentBlock: ContentBlock, callback: (start: number, end: number) => void) {
  const text = contentBlock.getText();
  let matchArr, start;
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
  }
}
const HandleSpan = (props: any) => {
  return (
    <span {...props} className="link">
      {props.children}
    </span>
  );
};

const HashtagSpan = (props: any) => {
  return (
    <span {...props} className="link">
      {props.children}
    </span>
  );
};

export default function TweetArea(props: TweetAreaProperties){

  const compositeDecorator = new CompositeDecorator([
    {
      strategy: handleStrategy,
      component: HandleSpan,
    },
    {
      strategy: hashtagStrategy,
      component: HashtagSpan,
    },
  ]);

  const [ editorState, setEditorState ] = useState(() => EditorState.createEmpty(compositeDecorator));
  const [ tweetContent, setTweetContent ] = useState("");
  const [ tweetStatus, setTweetStatus ] = useState<"posting" | "default">("default");
  const { images, addImages } = useContext(ImageSelectContext);
  const [ files, setFiles ] = useState<File[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);

  const [ overlayIndex, setOverlayIndex ] = useState<number>();
  const [ atPosition, setAtPosition ] = useState(-1);
  const [ suggestionQuery, setSuggestionQuery ] = useState("");
  const [ usersSuggestion, setUsersSuggestion ] = useState<User[]>([]);

  function onImageRemove(index: number){}

  useEffect(function(){
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent()
    const text = contentState.getPlainText();
    setTweetContent(text);
    const startOffset = selection.getStartOffset();
    if(text[startOffset - 1] === "@"){
      console.log("@")
      return void setAtPosition(startOffset);
    }
    // console.table({atPosition, suggestionQuery})
    if(atPosition === -1){
      return void overlayIndex;
    }
    const indexOfSpace = (index => index === -1 ? text.length : index)(text.indexOf(" ", atPosition));
    if(/^[A-z0-9_]$/.test(text[startOffset - 1])){
      setSuggestionQuery(text.substring(atPosition, indexOfSpace));
    }
    if(suggestionQuery){
      setOverlayIndex(
        props.onOverlay?.(
          <UserSelect users={ usersSuggestion } onSelect={ user => {
            console.log(user)
            setSuggestionQuery("");
            setAtPosition(-1)
            setUsersSuggestion([]);
            if(overlayIndex !== undefined){
              props.onOverlayRemove?.(overlayIndex);
            }
            // setAtPosition(-1)
          }  } />,
          overlayIndex
        )
      );
      // setAtPosition(-1);
    }
    if(suggestionQuery.length > 0){
      FetchRequest.get("/user/suggestions/:query", { query: suggestionQuery }).then(setUsersSuggestion);
    }
  }, [ editorState ]);

  return <div className="container w-fill gap tweet-area">

    {
      props.tweetRef ?
        <div className="container w-fill row gap">

          <div className="container h-fill center gap">
            <div className="container image"></div>
            <div className="line-v"></div>
          </div>

          <div className="container w-fill">

            <div className="container w-fill row gap-500">
              <div className="container row text title gap-250">{ props.tweetRef.user.name } {
                props.tweetRef.user.isVerified ? <Icon><VerifiedSVG/></Icon> : ""
              }</div>
              <span className="text sub-title">{ props.tweetRef.user.username }</span>
              <span className="text sub-title">· { timeElapsed(props.tweetRef.tweet.createdAt) }</span>
            </div>

            <p>{ props.tweetRef.tweet.content }</p>

          </div>

        </div>
      : <></>
    }

    <div className="container w-fill row">

      <div className="container h-fill">
        <div className="container image"></div>
      </div>

      <div className="container gap right-side">

        <Editor
          placeholder={ props.tweetRef ? "Tweet your reply" : "What's happening?" }
          editorState={ editorState }
          // value={ tweetContent }
          onChange={ setEditorState }
          // onKeyDown={ async ({ key, preventDefault }) => {
          //   if(key === "@"){
          //     return void toggleSuggestions(true);
          //   }
          //   if(suggestionsShown){
          //     if(key === "ArrowLeft" || key === "ArrowRight" || key === "ArrowUp" || key === "ArrowDown"){
          //       return void preventDefault();
          //     }
          //     if(key === "Backspace"){
          //       setSuggestionQuery(suggestionQuery.slice(0, suggestionQuery.length - 1));
          //     }
          //     else if(/^[A-z0-9]$/.test(key)){
          //       setSuggestionQuery(suggestionQuery + key);
          //     }
          //     setOverlayIndex(
          //       props.onOverlay?.(
          //         <UserSelect users={ usersSuggestion }/>,
          //         overlayIndex
          //       )
          //     );
          //   }
          //   if(suggestionQuery.length > 0){
          //     const users = await FetchRequest.get("/user/suggestions/:query", { query: suggestionQuery });
          //     setUsersSuggestion(users);
          //   }
          // } }
        ></Editor>

      </div>

    </div>


    <div className="container gap bottom-area">

      { <ImageSelect/> }

      <Button size="small">
        <Globe fontSize={ "1rem" }/>
        <span>Everyone can reply</span>
      </Button>

      <hr/>

      <div className="container row w-fill">

        <div className="container w-fill row actions">
          <input
            ref={ fileInput }
            type="file"
            accept="image/*"
            multiple={ true }
            hidden={ true }
            onChange={ ({ currentTarget }) => {
              setFiles(Array.from(currentTarget.files ?? []));
              const sources = files.map(file => URL.createObjectURL(file));
              addImages(...sources);
            } }
          />
          <IconButton
            onClick={ () => fileInput.current?.click() }
          ><Image/></IconButton>
          <IconButton><Gif/></IconButton>
          <IconButton><ListNumbers/></IconButton>
          <IconButton><Smiley/></IconButton>
          <IconButton><Calendar/></IconButton>
          <IconButton><MapPin/></IconButton>
        </div>

        <div className="container row center gap">
          <span className={
            "container ring"
            + (tweetContent.length === 0 || tweetContent.length >= 290 ? " no-outline" : "")
            + (tweetContent.length >= 280 ? " error" : tweetContent.length >= 260 ? " warn" : "")
          }>
            { tweetContent.length >= 290 ? (290 - tweetContent.length) : tweetContent.length >= 260 ? 20 - (tweetContent.length - 260) : "" }
            <svg height="100%" viewBox="0 0 20 20" width="100%" style={{
              overflow: "visible",
              position: "absolute"
            }}>
              <defs>
                <clipPath id="0.6681011017442833">
                  <rect height="100%" width="0" x="0"></rect>
                </clipPath>
              </defs>
              <circle cx="50%" cy="50%" fill="none" r="10" stroke="#ddd" strokeWidth="2"></circle>
              <circle cx="50%" cy="50%" fill="none" r="10" className="progress" strokeDasharray="62.83185307179586" strokeDashoffset={ 62.83185307179586 * (1 - clamp(tweetContent.length, 290) / 290) } strokeLinecap="round" strokeWidth="2"></circle>
              {/* <circle cx="50%" cy="50%" clip-path="url(#0.6681011017442833)" fill="#1D9BF0" r="0"></circle> */}
            </svg>
          </span>
          <hr/>
          <Button
            emphasis="high"
            disabled={ tweetStatus === "posting" || (tweetContent.length === 0 && files.length === 0) }
            onClick={
              async () => {
                setTweetStatus("posting");
                const formData = new FormData();
                formData.set("content", tweetContent.trim());
                const refId = props.tweetRef?.tweet?.retweetOfId ?? props.tweetRef?.tweet?.id;
                if(refId){
                  formData.set("refId", refId.toString());
                }
                for(const file of files){
                  formData.append("attachments", file);
                }
                try {
                  const data = await FetchRequest.sendFormData("post", "/tweet/", formData);
                  props.onTweet?.({
                    ...data,
                    likes: 0,
                    replies: 0,
                    retweets: 0,
                    attachments: [],
                  });
                  setTweetContent("");
                  setEditorState(EditorState.createEmpty(compositeDecorator));
                  setFiles([]);
                  images
                  if(overlayIndex){
                    props.onOverlayRemove?.(overlayIndex);
                  }
                } catch(error) {
                  console.log(error)
                }
                setTweetStatus("default");
              }
            }
          >{ props.tweetRef ? "Reply" : "Tweet" }</Button>
        </div>
        </div>
    </div>

  </div>;
}