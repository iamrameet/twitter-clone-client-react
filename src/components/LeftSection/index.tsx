import { Bell, Bookmark, BookmarkSimple, Bookmarks, BookmarksSimple, Gear, Hash, House, MagnifyingGlass, SignOut, TwitchLogo, TwitterLogo, User } from "@phosphor-icons/react";
import Icon from "../Icon";
import { Icon as PhosphorIcon } from "@phosphor-icons/react/dist/lib";
import "./LeftSection.css";
import Button from "../Button";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/AuthUser";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import FetchRequest from "../../scripts/fetch-request";

type LeftSectionProps = {
  navIndex?: string;
  onNavIdChange?: (navIndex: string) => void;
  onTweetButtonClick: React.MouseEventHandler<HTMLButtonElement>;
};

type NavItemProperties = {
  id: string;
  children: JSX.Element;
  text?: string;
  isActive?: boolean;
  iconWeight?: "fill" | "regular";
  onClick?: () => void;
};

type NavListItemProperties = {
  id: string;
  children: JSX.Element;
  text: string;
};

function NavItem(props: NavItemProperties){

  const IconElement = props.children.type as PhosphorIcon;

  return <div
    className={ "container w-fill row pad-500 item" + (props.isActive ? " active" : "") }
    onClick={ props.onClick }
  >
    <div className="container row center item-row">
      <Icon>
        <IconElement weight={ props.isActive ? "fill" : props.iconWeight ?? "regular" }/>
      </Icon>
      { props.text ? <span>{ props.text }</span> : <></> }
    </div>
  </div>;

}

function NavListItem(props: NavListItemProperties){

  const location = useLocation();
  const navigate = useNavigate();
  const id = "/" + props.id;

  return <NavItem
    id={ props.id }
    text={ props.text }
    isActive= { location.pathname === id }
    onClick={ () => navigate(id) }
  >
    { props.children }
  </NavItem>

}

export default function LeftSection(props: LeftSectionProps){

  const { userData, setUserData } = useContext(UserContext);

  return <section className="container left-section">
    <div className="container w-fill h-fill items">

      <NavItem id="" iconWeight="fill">
        <TwitterLogo/>
      </NavItem>

      {
        userData ?
          <NavListItem id="home" text="Home">
            <House/>
          </NavListItem>
        : <></>
      }

      <NavListItem id="explore" text="Explore">
        <Hash/>
      </NavListItem>

      {
        userData ?
          <NavListItem id='notifications' text="Notifications">
            <Bell/>
          </NavListItem>
        : <></>
      }

      <NavListItem id="search" text="Search">
        <MagnifyingGlass/>
      </NavListItem>

      {
        userData ? <>

          <NavListItem id="profile" text="Profile">
            <User/>
          </NavListItem>

          <div className="container w-fill row pad-500 item tweet-item">
            <Button
              width="w-fill"
              size="large"
              emphasis="high"
              onClick={ props.onTweetButtonClick }
            >
              <Icon padding="less">
                <svg viewBox="0 0 24 24">
                  <g>
                    <path d="M23 3c-6.62-.1-10.38 2.421-13.05 6.03C7.29 12.61 6 17.331 6 22h2c0-1.007.07-2.012.19-3H12c4.1 0 7.48-3.082 7.94-7.054C22.79 10.147 23.17 6.359 23 3zm-7 8h-1.5v2H16c.63-.016 1.2-.08 1.72-.188C16.95 15.24 14.68 17 12 17H8.55c.57-2.512 1.57-4.851 3-6.78 2.16-2.912 5.29-4.911 9.45-5.187C20.95 8.079 19.9 11 16 11zM4 9V6H1V4h3V1h2v3h3v2H6v3H4z"></path>
                  </g>
                </svg>
              </Icon>
              <span>Tweet</span>
            </Button>

          </div>

          <NavItem
            id="logout"
            text="Logout"
            onClick={
              async () => {
                FetchRequest.delete("/user/logout");
                setUserData(undefined);
              }
            }
          >
            <SignOut/>
          </NavItem>

        </> : <></>
      }

    </div>
  </section>;
};