const initialState = {
  text: "",
  time: "",
  // token: null,
};
export const ToastReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ShowToast":
      return Object.assign({}, state, {
        ...action.data,
        text: action.value.text,
        time: action.value.time,
      });
    default:
      return state;
  }
};
