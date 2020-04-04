import { FETCH_BUILDS_SUCCESS, FETCH_BUILDS_ERROR } from "../actions/";

const initialBuildListState = [];
const initialCurrentBuild = {}

export const buildsList = (state = initialBuildListState, action) => {
  switch (action.type) {
    case FETCH_BUILDS_SUCCESS:
      return action.payload
    default:
      return state;
  }
};

export const currentBuild = (state = initialCurrentBuild, action) => {
  switch (action.type) {
    case FETCH_BUILDS_SUCCESS:
      return action.payload
    default:
      return state;
  }
};

// export const currentBuild = (state = {}, action) => {
//   switch (action.type) {
//     case SAVE_CURRENT_BUILD_TO_REDUX:
//       return action.payload;
//     default:
//       return state;
//   }
// };
