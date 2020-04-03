import { combineReducers } from "redux";
import settingsReducers from "./settingsReducers";
import { saveBuilds, currentBuild } from "./buildsReducers";

export default combineReducers({
  settings: settingsReducers,
  builds: saveBuilds,
  currentBuild: currentBuild,
});
