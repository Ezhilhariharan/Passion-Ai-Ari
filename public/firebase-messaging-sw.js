// Scripts for firebase and firebase messaging
// eslint-disable-next-line no-undef
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
// eslint-disable-next-line no-undef
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");
// Initialize the Firebase app in the service worker by passing the generated config
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
// new code
const firebaseConfig = {
  apiKey: "AIzaSyDLuHHxOroAz1ZloYnyilerodT6LJ13f-I",
  authDomain: "passion-ai-notifications.firebaseapp.com",
  projectId: "passion-ai-notifications",
  storageBucket: "passion-ai-notifications.appspot.com",
  messagingSenderId: "211447117319",
  appId: "1:211447117319:web:c53db77ffd9cfc49dddca2",
  measurementId: "G-03L7ZYKLN6"
}
// eslint-disable-next-line no-undef
firebase.initializeApp(firebaseConfig);
// Retrieve firebase messaging
// eslint-disable-next-line no-undef
const messaging = firebase.messaging();
messaging.onBackgroundMessage(function (payload) {
  console.log("payload",payload)
  let notificationTitle = null;
  let notificationOptions = {
    body: null,
    icon: "/logo192.png",
  };
  if (payload.hasOwnProperty("notification")) {
    (notificationTitle = payload.notification.title),
      (notificationOptions.body = payload.notification.body);
  } else if (!Object.hasOwnProperty("notification")) {
    (notificationTitle = "sample"),
      (notificationOptions.body = payload.data.default);
  } else {
    alert("payload format not match");
  }
  // eslint-disable-next-line no-restricted-globals
  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});
