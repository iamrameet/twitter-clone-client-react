import "./style.css";
import { At, Chat, Heart, Repeat, TwitterLogo, User } from "@phosphor-icons/react";
import { NotificationResponse } from "../../helper/notification";
import Icon from "../Icon";
import { Icon as PhosphorIcon } from "@phosphor-icons/react/dist/lib";
import { NotificationSchema } from "../../helper/schema";
import { Tweet } from "../../helper/tweet";

export default function NotificationItem(props: { icon: JSX.Element, iconColor?: string, children: (string | JSX.Element) | (string | JSX.Element)[] }){

  const { iconColor, children } = props;
  const DisplayIcon = props.icon.type as PhosphorIcon;

  return <div className="container w-fill row pad gap hover">

    <div className="container h-fill box end notification-type-icon" style={{ color: iconColor }}>
      <Icon>{ <DisplayIcon weight="fill" { ...props.icon.props }/> }</Icon>
    </div>

    <div className="container h-fill">
      <p>{ children }</p>
    </div>

  </div>;

}

function FollowNotificationItem({ notification }: { notification: NotificationSchema<"follow"> }){

  return <NotificationItem icon={ <User/> }>
    { notification.content.follower.name }
    <span className="text sub-title"> followed you</span>
  </NotificationItem>;

};

function LikeNotificationItem({ notification }: { notification: NotificationSchema<"like"> }){

  return <NotificationItem icon={ <Heart/> } iconColor="#ec4899">
    { notification.content.user.name }
    <span className="text sub-title"> liked your tweet</span>
  </NotificationItem>;

};

function ReplyNotificationItem({ notification }: { notification: NotificationSchema<"reply"> }){

  return <NotificationItem icon={ <Chat/> }>
    { notification.content.user.name }
    <span className="text sub-title"> replied to your tweet</span>
  </NotificationItem>;

};

function RetweetNotificationItem({ notification }: { notification: NotificationSchema<"retweet"> }){

  return <NotificationItem icon={ <Repeat/> } iconColor="#10b981">
    { notification.content.user.name }
    <span className="text sub-title"> retweeted your tweet</span>
  </NotificationItem>;

};

function MentionNotificationItem({ notification }: { notification: NotificationSchema<"mention"> }){

  return <NotificationItem icon={ <At weight="bold"/> } iconColor="#10b981">
    { notification.content.user.name }
    <span className="text sub-title"> mentioned you in their tweet</span>
  </NotificationItem>;

};

function LoginNotificationItem({ notification }: { notification: NotificationSchema<"login"> }){

  return <NotificationItem icon={ <TwitterLogo weight="fill"/> }>
    <span className="text">There was a login to your account from a new device on { notification.created_at }.</span>
  </NotificationItem>;

};

export function notificationItem(notification: NotificationResponse){
  switch(notification.type){
    case "follow":
      return <FollowNotificationItem notification={ notification }/>
    case "like":
      return <LikeNotificationItem notification={ notification }/>
    case "reply":
      return <ReplyNotificationItem notification={ notification }/>
    case "retweet":
      return <RetweetNotificationItem notification={ notification }/>
    case "mention":
      return <MentionNotificationItem notification={ notification }/>
    case "login":
      return <LoginNotificationItem notification={ notification }/>
  }
};