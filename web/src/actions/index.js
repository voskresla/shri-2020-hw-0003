// import API
import api from "../api/schoolcicerver";

// CONST
export const CLEAR_SETTINGS_FLAGS = "CLEAR_SETTINGS_FLAGS";
export const FETCH_SETTINGS_ERROR = "FETCH_SETTINGS_ERROR";

export const SAVE_SETTINGS_TO_REDUX = "SAVE_SETTINGS_TO_REDUX";

export const POST_SETTINGS_BEGIN = "POST_SETTINGS_BEGIN";
export const POST_SETTINGS_SUCCESS = "POST_SETTINGS_SUCCESS";
export const POST_SETTINGS_ERROR = "POST_SETTINGS_ERROR";

export const SAVE_BUILDS_TO_REDUX = "SAVE_BUILDS_TO_REDUX";
export const SAVE_CURRENT_BUILD_TO_REDUX = "SAVE_CURRENT_BUILD_TO_REDUX";

export const FETCH_BUILDS_SUCCESS = "FETCH_BUILDS_SUCCESS"
export const FETCH_BUILDS_ERROR = "FETCH_BUILDS_ERROR"

export const init = () => async (dispatch) => {
	try {
		const response = await api.get("/settings");
		dispatch({ type: SAVE_SETTINGS_TO_REDUX, payload: response.data });
	} catch (e) {
		dispatch({ type: FETCH_SETTINGS_ERROR })

	}
}

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
		dispatch({ type: SAVE_SETTINGS_TO_REDUX, payload: settings });
	} catch (e) {
		dispatch({ type: POST_SETTINGS_ERROR, payload: 'Сервер недоступен.' });
	}
};

export const clearSettingsFlags = () => {
	return {
		type: CLEAR_SETTINGS_FLAGS,
	};
}

export const getBuildsListFromYNDX = () => async (dispatch) => {
	try {
		const response = await api.get('/builds')
		dispatch({ type: FETCH_BUILDS_SUCCESS, payload: response.data })
	} catch (e) {
		console.log('FETCH_BUILDS_ERROR')
		dispatch({ type: FETCH_BUILDS_ERROR })
	}
}

export const getCurrentBuildByNumber = (number) => async (dispatch) => {
	try {

	} catch (e) {

	}
}




