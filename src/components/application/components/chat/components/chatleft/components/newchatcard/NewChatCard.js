import React from "react";
const NewChatCard = ({ data, createChatWithUser, setCurrentUser }) => {
  return (
    <div
      className="chat-message-card"
      onClick={() => {
        if (data.room_id !== null) {
          setCurrentUser({
            room_id: data.room_id,
            profile_image: data.profile_image,
            name: data.name,
            chat_url: data.chat_url,
          });
        } else {
          createChatWithUser(data.uuid);
        }
      }}
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
      </div>
    </div>
  );
};
export default NewChatCard;
