const initialState = {
  title: "",
  body: "",
  time: "",
  token: null,
};
export const NotificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case "NOTIFY_ME":
      return Object.assign({}, state, {
        ...action.data,
        title: action.data.title,
        body: action.data.body,
        time: new Date().getTime(),
      });
    case "SET_TOKEN":
      return Object.assign({}, state, {
        ...state,
        token: action.data,
      });
    default:
      return state;
  }
};
