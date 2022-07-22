const initialState = {
  NotificationTime: "",
};
export const ShowNotification = (state = initialState, action) => {
  switch (action.type) {
    case "ShowNotification":
      // 
      return {
        ...state,
        NotificationTime: new Date().getTime(),
      };
    default:
      return state;
  }
};
