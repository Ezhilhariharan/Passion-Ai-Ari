import firebase from "firebase/app";
import "firebase/messaging";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// old code
// const firebaseConfig = {
//   apiKey: "AIzaSyAkLxqOWLX1nATjukG3vBezWwtjkQUAC1M",
//   authDomain: "passionaiari.firebaseapp.com",
//   projectId: "passionaiari",
//   storageBucket: "passionaiari.appspot.com",
//   messagingSenderId: "809187588387",
//   appId: "1:809187588387:web:62f0fa3c0aea6b0722b496",
//   measurementId: "G-VQ3G2ZDW17",
// };
// NEW CODE
const firebaseConfig = {
  apiKey: "AIzaSyDLuHHxOroAz1ZloYnyilerodT6LJ13f-I",
  authDomain: "passion-ai-notifications.firebaseapp.com",
  projectId: "passion-ai-notifications",
  storageBucket: "passion-ai-notifications.appspot.com",
  messagingSenderId: "211447117319",
  appId: "1:211447117319:web:c53db77ffd9cfc49dddca2",
  measurementId: "G-03L7ZYKLN6"
}
const firebase1 = firebase.initializeApp(firebaseConfig);
let messaging = null;
const { REACT_APP_VAPID_KEY } = process.env;
const publicKey = REACT_APP_VAPID_KEY;
if (firebase.messaging.isSupported()) {
  messaging = firebase1.messaging();
  console.error("messaging suppported");
}
export const FCMToken = async () => {
  // 
  let token = "";
  try {
    token = await messaging.getToken({ vapidKey: publicKey });
  } catch (error) {
    return null;
  }
  return token;
};
export const onMessageListener = () =>
  new Promise((resolve) => {
    messaging.onMessage((payload) => {
      resolve(payload);
    });
  });
export default firebase1;
