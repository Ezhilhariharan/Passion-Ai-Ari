function getDecodedValue() {
  const Notification_list = localStorage.getItem("Notification_List");
  if (Notification_list === null)
    return {
      List: [],
      Time: "",
    };
  else {
    return {
      List: JSON.parse(Notification_list),
      Time: new Date().getTime() + 1,
    };
  }
}
let initialState = getDecodedValue();
export const NotificationList = (state = initialState, action) => {
  switch (action.type) {
    case "Notification_List":
      localStorage.setItem(
        "Notification_List",
        JSON.stringify(action.value.list)
      );
      return {
        ...state,
        List: action.value.list,
        Time: action.value.Time,
      };
    default:
      return state;
  }
};
