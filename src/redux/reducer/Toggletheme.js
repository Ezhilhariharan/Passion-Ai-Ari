// store
let initialState = {
  is_dark: false,
};
const ChangeThemeReducer = (state = initialState, action) => {
  //   const { type, payload } = action;
  // 
  switch (action.type) {
    case "TOGGLE_THEME":
      // 
      // state.is_dark=!state.is_dark
      // 
      return Object.assign({}, state, {
        is_dark: !state.is_dark,
      });
    default:
      return state;
  }
};
// 
export default ChangeThemeReducer;
