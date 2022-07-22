import instance from "services/Instance";
export function getUserRoom() {
  return instance.get("/users/manage_chat_room/");
}
export function getUserChats(room_id) {
  return instance.get(`/users/manage_chat_room/${room_id}/`);
}
export function getUsersForChat(room_id) {
  return instance.get(`/users/manage_chat_room/${room_id}/new_chat/`);
}
export function getUserChatData(room_id, page_no = 1) {
  return instance.get(
    `/users/manage_chat_room/${room_id}/get_messages/?page_no=${page_no}`
  );
}
export function getavailableChats(room_id) {
  return instance.get(`/users/manage_chat_room/${room_id}/new_chat/`);
}
