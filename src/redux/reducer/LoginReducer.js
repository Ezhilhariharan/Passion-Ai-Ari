function getDecodedValue() {
  const username = localStorage.getItem("username");
  const profile_image = localStorage.getItem("profile_image");
  if (username && profile_image === null)
    return {
      isLoggedIn: false,
      username: null,
      profile_image: null,
    };
  else {
    return {
      isLoggedIn: true,
      username: username,
      profile_image: profile_image,
    };
  }
}
let initialState = getDecodedValue();
export const UserReducer = (state = initialState, action) => { 
  switch (action.type) {
    case "SET_USER":
      // 
      localStorage.setItem("username", action.value.user.name);
      localStorage.setItem("profile_image", action.value.user.profile_image);
      return {
        ...state,
        isLoggedIn: true,
        username: action.value.user.name,
        profile_image: action.value.user.profile_image,
      };
    case "UPDATE_HEADER":
      // 
      localStorage.setItem("profile_image", action.value);
      return {
        ...state,
        isLoggedIn: true,
        profile_image: action.value,
      };
    case "UPDATE_USERNAME":
      localStorage.setItem("username", action.value);
      return {
        ...state,
        isLoggedIn: true,
        username: action.value,
      };
    case "LOGIN_FAIL":
      return {
        ...state,
        isLoggedIn: false,
        user: null,
      };
    case "LOGOUT":
      return {
        ...state,
        isLoggedIn: false,
        user: null,
      };
    default:
      return state;
  }
};
