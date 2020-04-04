import {
  SAVE_SETTINGS_TO_REDUX,
  FETCH_SETTINGS_BEGIN,
  FETCH_SETTINGS_SUCCESS,
  FETCH_SETTINGS_ERROR,
  SAVE_SETTINGS_TO_YNDX,
  POST_SETTINGS_BEGIN,
  POST_SETTINGS_SUCCESS,
  POST_SETTINGS_ERROR,
} from "../actions/";

export default (state = {}, action) => {
  // console.log("action.payload from settingsReducer:", action.payload);
  switch (action.type) {
    case SAVE_SETTINGS_TO_REDUX:
      return action.payload;
    default:
      return state;
  }
};
