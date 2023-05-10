import Pusher from "pusher-js";

// Enable pusher logging - don"t include this in production
Pusher.logToConsole = true;

const pusher = new Pusher("1b24faad87f6bb143243", {
  cluster: "ap2",
  authEndpoint: "https://twitter-clone-excs.onrender.com/pusher/auth",
  authTransport: "ajax"
});

pusher.signin();

const channel = pusher.subscribe("messages");
channel.bind("message", function (data: {}) {
  alert(JSON.stringify(data));
});