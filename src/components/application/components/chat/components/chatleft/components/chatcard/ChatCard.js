import React from "react";
import moment from "moment";
moment.locale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: "seconds",
    ss: "%ss",
    m: "a minute",
    mm: "%dm",
    h: "an hour",
    hh: "%dh",
    d: "a day",
    dd: "%dd",
    M: "a month",
    MM: "%dM",
    y: "a year",
    yy: "%dY",
  },
});
const ChatCard = ({ data, setCurrentUser }) => {
  let last_message_time = new Date(data.last_message_time);
  let today = new Date();
  // let rgx = new RegExp(
  // 	"([a-zA-Z]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?"
  // );
  if (
    last_message_time.getDate() == today.getDate() &&
    last_message_time.getMonth() == today.getMonth() &&
    last_message_time.getFullYear() == today.getFullYear()
  ) {
    last_message_time = `${last_message_time.getHours()}:${last_message_time.getMinutes()}`;
  } else {
    last_message_time = `${last_message_time.getDate()}/${
      last_message_time.getMonth() + 1 >= 9
        ? last_message_time.getMonth() + 1
        : "0" + (last_message_time.getMonth() + 1)
    }/${last_message_time.getFullYear()}`;
  }
  // 
  return (
    <div
      className="chat-message-card"
      onClick={() =>
        setCurrentUser({
          room_id: data.room_id,
          profile_image: data.profile_image,
          name: data.name,
          chat_url: data.chat_url,
          is_online: data.is_online,
        })
      }
      data-room={data.room_id}
    >
      <div className="chat-card-header">
        <div className="left">
          <div className="pic">
            <img
              src={
                data.profile_image
                  ? data.profile_image
                  : "https://via.placeholder.com/150"
              }
              onError={(e) =>
                (e.target.src = "https://via.placeholder.com/150")
              }
              alt={data.username}
            />
          </div>
          <span className="name">{data.name}</span>
        </div>
        <div className="right">
          {data.last_message_time && (
            <div className="time">
              {moment
                .utc(data.last_message_time)
                .local()
                .startOf("seconds")
                .fromNow()}
            </div>
          )}
          <div className={data.is_online ? "online mt-2" : "offline mt-2"}>
            {data.is_online ? "Online" : "Offline"}
          </div>
        </div>
      </div>
      <div className="chat-card-body">
        {/* {JSON.stringify(data.last_message)} */}
        {data.last_message_type == "TXT"
          ? data.last_message
          : data.last_message && "Image"}
      </div>
    </div>
  );
};
export default ChatCard;
