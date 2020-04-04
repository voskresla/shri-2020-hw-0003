// import API
import api from "../api/schoolcicerver";
import { history } from '../utils/'

// CONST
export const SAVE_SETTINGS_TO_REDUX = "SAVE_SETTINGS_TO_REDUX";
export const FETCH_SETTINGS_BEGIN = "FETCH_SETTINGS_BEGIN";
export const FETCH_SETTINGS_SUCCESS = "FETCH_SETTINGS_SUCCESS";
export const FETCH_SETTINGS_ERROR = "FETCH_SETTINGS_ERROR";
export const SAVE_SETTINGS_TO_YNDX = "SAVE_SETTINGS_TO_YNDX";
export const POST_SETTINGS_BEGIN = "POST_SETTINGS_BEGIN";
export const POST_SETTINGS_SUCCESS = "POST_SETTINGS_SUCCESS";
export const POST_SETTINGS_ERROR = "POST_SETTINGS_ERROR";

export const SAVE_BUILDS_TO_REDUX = "SAVE_BUILDS_TO_REDUX";
export const SAVE_CURRENT_BUILD_TO_REDUX = "SAVE_CURRENT_BUILD_TO_REDUX";

// забрали настройки с сервера
export const getSettingsFromYNDX = () => async (dispatch) => {
	try {
		const response = await api.get("/settings");
		dispatch({ type: SAVE_SETTINGS_TO_REDUX, payload: response.data });
	} catch (e) {
		dispatch({ type: FETCH_SETTINGS_ERROR })
	}
};

export const saveSettingsToYNDX = (settings) => async (dispatch) => {
	dispatch({ type: POST_SETTINGS_BEGIN });
	try {
		const response = await api.post("/settings", settings);

		if (response.status === 200 && response.statusText !== 'OK') {
			dispatch({ type: POST_SETTINGS_ERROR, payload: response.data.message });
			return
		}

		dispatch({ type: POST_SETTINGS_SUCCESS })

		function sleep(ms) {
			return new Promise(resolve => setTimeout(resolve, ms));
		}
		await sleep(1000);

		history.push('/')
	} catch (e) {

		dispatch({ type: POST_SETTINGS_ERROR, payload: 'Сервер недоступен.' });
	}
};



export const saveBuildsToRedux = (payload) => {
	return {
		type: SAVE_BUILDS_TO_REDUX,
		payload: payload,
	};
};

export const saveCurrentBuildToRedux = (payload) => {
	return {
		type: SAVE_CURRENT_BUILD_TO_REDUX,
		payload: payload,
	};
};
