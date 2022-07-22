import * as redux from "redux";
import { UserReducer } from "../reducer/LoginReducer";
import ChangeThemeReducer from "../reducer/Toggletheme";
import { NotificationReducer } from "../reducer/notificationReducer";
import { ToastReducer } from "../reducer/ToastReducer";
import { LoadingReducer } from "../reducer/LoadingReducer";
import { FilterDataReducer } from "../reducer/FilterIndustryData";
import { ShowNotification } from "../reducer/showNotification";
import { NotificationList } from "../reducer/NotificationList";
const rootReducer = redux.combineReducers({
  user: UserReducer,
  theme: ChangeThemeReducer,
  notify: NotificationReducer,
  toast: ToastReducer,
  loading: LoadingReducer,
  filterdata: FilterDataReducer,
  Notification: ShowNotification,
  List: NotificationList,
});
const store = redux.createStore(rootReducer);
export default store;
