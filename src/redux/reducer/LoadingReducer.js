const initialState = {
  loadingState: "",
};
export const LoadingReducer = (state = initialState, action) => {
  switch (action.type) {
    case "Loading":
      return Object.assign({}, state, {
        ...action.data,
        loadingState: action.value.loadingState,
      });
    default:
      return state;
  }
};
