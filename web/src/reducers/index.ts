import { combineReducers } from "redux";
import settingsReducers from "./settingsReducers";
import { buildsList, currentBuild } from "./buildsReducers";
import localeReducers from './localeReducers';

export default combineReducers({
	settings: settingsReducers,
	builds: buildsList,
	currentBuild: currentBuild,
	locale: localeReducers
});
