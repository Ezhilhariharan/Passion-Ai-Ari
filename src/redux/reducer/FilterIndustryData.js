function getDecodedValue() {
  const IFD_OBJ = localStorage.getItem("IFD-obj");
  if (IFD_OBJ === null) {
    return {
      filterData: [],
    };
  } else {
    return {
      filterData: JSON.parse(IFD_OBJ),
    };
  }
}
const initialState = getDecodedValue();
export const FilterDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case "Industry-Data":
      localStorage.setItem("IFD-obj", JSON.stringify(action?.filterdata));
      return Object.assign({}, state, {
        ...action,
        filterData: action?.filterdata,
      });
    default:
      return state;
  }
};
