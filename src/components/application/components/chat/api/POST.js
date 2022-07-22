import axios from "axios";
import instance from "services/Instance";
// export function newChat(room_id,uuid){
// 	return new Promise((resolve,reject)=>{
// 		let data = new FormData()
// 		data.append('room_owner_id',uuid)
// 		axios.post(`/users/manage_chat_room/${room_id}/new_chat`,data)
// 		.then(res=>{
// 			resolve(res.data)
// 		})
// 		.catch(err=>{
// 			reject(err)
// 		})
// 	})
// }
export class postAPI {
  newChat(room_id, uuid) {
    return new Promise((resolve, reject) => {
      let data = new FormData();
      data.append("room_owner_id", uuid);
      axios
        .post(`/users/manage_chat_room/${room_id}/new_chat`, data)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  uploadPic(value) {
    return new Promise((resolve, reject) => {
      instance
        .post("/users/manage_chat_room/manage_media_files/", value)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
