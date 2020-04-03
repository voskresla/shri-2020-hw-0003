import { SAVE_BUILDS_TO_REDUX, SAVE_CURRENT_BUILD_TO_REDUX } from "../actions/";

const initialBuildsState = {};

export const saveBuilds = (state = initialBuildsState, action) => {
  // console.log("action.payload from buildsReducer:", action.payload);
  switch (action.type) {
    case SAVE_BUILDS_TO_REDUX:
      return action.payload;
    default:
      return state;
  }
};

export const currentBuild = (state = {}, action) => {
  switch (action.type) {
    case SAVE_CURRENT_BUILD_TO_REDUX:
      return action.payload;
    default:
      return state;
  }
};
