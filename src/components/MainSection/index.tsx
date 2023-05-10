import { createBrowserRouter, RouterProvider, Outlet, RouterProviderProps } from "react-router-dom";
import "./Style.css";
import HomeSection from "./HomeSection";
import ExploreSection from "./ExploreSection";
import SearchSection from "./SearchSeaction";
import ProfileSection, { UserProfileSection } from "./ProfileSection";
import { User } from "../../helper/user";
import { TweetContentProperties } from "../TweetPost";
import { MappedTweet } from "../../scripts/tweets";
import { UserResponse } from "../../helper/user";
import NotificationsSection from "./NotificationsSection";
import { UserContext } from "../context/AuthUser";
import { useContext } from "react";

export type SectionId = "home" | "explore" | "search" | "profile" | "notifications";

type MainSectionProperties = {
  children: JSX.Element;
};

export default function MainSection(props: MainSectionProperties){

  return <main className="container w-fill min-h-fill main-container">
    { props.children }
  </main>;

};