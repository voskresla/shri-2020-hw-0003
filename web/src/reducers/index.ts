import { combineReducers } from "redux";
import settingsReducers from "./settingsReducers";
import { buildsList, currentBuild } from "./buildsReducers";

export default combineReducers({
	settings: settingsReducers,
	builds: buildsList,
	currentBuild: currentBuild,
});
