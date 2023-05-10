import IconButton from "../../IconButton";
import Icon from "../../Icon";
import { Gear, MagnifyingGlass } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { getTrending } from "../../../scripts/hashtag";
import HashtagPost from "../../HashtagPost";
import FetchRequest from "../../../scripts/fetch-request";
import NotificationItem, { notificationItem } from "../../NotificationItem";

function getAll(){
  return FetchRequest.get("/notification/");
}

export default function NotificationsSection(){

  const [ notifications, setNotifications ] = useState<Awaited<ReturnType<typeof getAll>>>([]);

  useEffect(function(){
    getAll().then(setNotifications);
  }, []);

  return <>
    <header className="container w-fill">

      <div className="container w-fill row gap pad-500 pad-h">
        <h2>Notifications</h2>
      </div>

      <nav className="container w-fill row nav-bar">
        {/* <a href="#" className="container w-fill active">For You</a> */}
        <a href="#" className="container w-fill active">All</a>
        {/* <a href="#" className="container w-fill">News</a>
        <a href="#" className="container w-fill">Sports</a>
        <a href="#" className="container w-fill">Entertainment</a> */}
      </nav>

    </header>

    <section className="container w-fill h-fill auto">
      {
        notifications.map(notificationItem)
      }
    </section>

  </>;
};