import { useContext, useEffect, useState } from 'react'
import './App.css'
import AuthNavigation from './components/AuthNavigation'
import LeftSection from './components/LeftSection'
import MainSection, { SectionId } from './components/MainSection'
import AuthArea, { SignupArea } from './components/AuthArea'
import TweetArea from './components/TweetArea'
import DialogBox, { OverlayContext, OverlayList } from './components/DialogBox'
import FetchRequest, { GetEndPointResponseMap } from './scripts/fetch-request'
import { Tweet } from './helper/tweet'
import Overlay from './components/Overlay'
import { OnlyReqUser, TweetContentProperties, TweetPostUser } from './components/TweetPost'
import { MappedTweet } from './scripts/tweets'
import AuthUserStates, { UserContext } from './components/context/AuthUser'
import { ImageSelectProvider } from './components/TweetArea/ImageSelect'
import Paginator from './components/Paginator'
import BitBool from './scripts/bit-bool'
import { UserResponse } from './helper/user'
import ProfileSection, { UserProfileSection } from './components/MainSection/ProfileSection'
import SearchSection from './components/MainSection/SearchSeaction'
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom'
import HomeSection from './components/MainSection/HomeSection'
import NotificationsSection from './components/MainSection/NotificationsSection'
import ExploreSection from './components/MainSection/ExploreSection'

const pageMap: SectionId[] = [ "home", "explore", "notifications", "search", "profile" ];

function App() {

  const { userData, setUserData } = useContext(UserContext);
  const [ authState, setAuthState ] = useState<"pending" | "success" | "failed">("pending");
  const [ authAreaType, setAuthArea ] = useState<"none" | "login" | "signup">("none");
  const [ shouldRenderTweetDialog, toggleTweetDialog ] = useState(false);
  const [ tweetRef, setTweetRef ] = useState<{ user: TweetPostUser, tweet: Tweet }>();

  const [ overlays, setOverlays ] = useState<JSX.Element[]>([]);
  const { dialogs, addDialog, removeDialog } = OverlayList();

  const [ tweets, setTweets ] = useState<MappedTweet[]>([]);

  function onTweetReplyClick(user: TweetPostUser, tweet: Tweet){
    toggleTweetDialog(true);
    setTweetRef({ user, tweet });
  }

  const element = <OverlayContext.Provider value={{
    openHandle: addDialog,
    closeHandle: removeDialog
  }}>{
    authState === "failed" ? <>
      <div className="container w-fill h-fill center-h auto base">
        <LeftSection
          onTweetButtonClick={ () => toggleTweetDialog(true) }
        />
        <MainSection>
          <Outlet/>
        </MainSection>
      </div>
      <AuthNavigation onButtonClick={ type => setAuthArea(type) }/>
      { authAreaType === "login" ? <AuthArea
        closeHandle={ () => void setAuthArea("none") }
        onSuccess={ () => setAuthState("success") }
      />
        : authAreaType === "signup" ? <SignupArea
          closeHandle={ () => void setAuthArea("none") }
          onSuccess={ () => setAuthState("success") }
        /> : "" }
    </> : authState === "success" ?
        <>
          <Paginator limit={ 10 }>
            <div className="container w-fill h-fill base center-h auto">
              <LeftSection
                onTweetButtonClick={ () => toggleTweetDialog(true) }
              />
              <MainSection>
                <Outlet/>
              </MainSection>
            </div>
          </Paginator>
          {
            shouldRenderTweetDialog ?
              <DialogBox closeHandle={ () => toggleTweetDialog(false) }>
                <ImageSelectProvider>
                  <TweetArea
                    onTweet={ addTweet }
                    onOverlay={ addOverlay }
                    onOverlayRemove={ removeOverlay }
                    tweetRef={ tweetRef }
                  ></TweetArea>
                </ImageSelectProvider>
              </DialogBox>
            : ""
          }
          {
            overlays.map((children, index) => {
              return <Overlay closeHandle={ () => removeOverlay(index) }>{ children }</Overlay>
            })
          }
          { dialogs }
        </>
     : <div className="container w-fill h-fill center">
      <div className="spinner"></div>
    </div>
  }</OverlayContext.Provider>;

  const router = createBrowserRouter([
    {
      path: "/",
      element,
      children: [{
        path: "search",
        element: <SearchSection onTweetReplyClick={ onTweetReplyClick }/>
      }, {
        path: "home",
        element: <HomeSection
          tweets={ tweets }
          onOverlay={ addOverlay }
          onTweetReplyClick={ onTweetReplyClick }
        />
      }, {
        path: "search",
        element: <SearchSection
          onTweetReplyClick={ onTweetReplyClick }
        />
      }, {
        path: "profile",
        element: <ProfileSection
          tweets={ tweets }
          onTweetReplyClick={ onTweetReplyClick }
        />
      }, {
        path: "notifications",
        element: <NotificationsSection/>
      }, {
        path: "/explore",
        element: <ExploreSection/>
      }, {
        path: ":username",
        element: <UserProfileSection onTweetReplyClick={ onTweetReplyClick }/>
      }, {
        path: "/",
        element: <ExploreSection/>
      }]
    }
  ]);

  function addTweet(tweet: Tweet){
    if(userData === undefined){
      return;
    }
    setTweets([ {
      ...tweet,
      isLiked: tweet.isLiked ?? false,
      isRetweeted: tweet.isRetweeted ?? false,
      retweetOfId: tweet.retweetOfId,
      user: { ...userData, image: userData.image }
    }, ...tweets ]);
  }

  function addOverlay(overlay: JSX.Element, index?: number){
    index ??= overlays.length;
    overlays.splice(index, 1, overlay);
    setOverlays([ ...overlays ]);
    return index;
  }

  function removeOverlay(index: number){
    console.log(overlays.length, index)
    overlays.splice(index, 1);
    setOverlays([ ...overlays ]);
  }

  useEffect(() => {
    void async function(){
      try{
        setUserData(await FetchRequest.get("/user/"));
        setAuthState("success");
      } catch(ex) {
        setAuthState("failed");
        console.log("auth", JSON.parse(ex as string).reason);
      }
    }();
  }, []);

  return <RouterProvider router={ router }/>;

}

export default App;