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

const initialSettingsState = {
	conf: {},
	isLoaded: false,
	isSavedYNDX: false,
	isSavingToYNDX: false,
	isSavedToYNDX: false,
	isSavingToError: false,
	isError: false,
	errorText: '',
	successText: ''
}

export default (state = initialSettingsState, action) => {
	// console.log("action.payload from settingsReducer:", action.payload);
	switch (action.type) {
		case SAVE_SETTINGS_TO_REDUX:
			return {
				...state,
				conf: { ...action.payload },
				isLoaded: true,
				isError: false
			};
		case FETCH_SETTINGS_ERROR:
			return {
				...state,
				isLoaded: true,
				isError: true
			};
		case POST_SETTINGS_BEGIN:
			return {
				...state,
				isSavingToYNDX: true,
				errorText: ''
			};
		case POST_SETTINGS_ERROR:
			return {
				...state,
				isSavingToYNDX: false,
				isSavingToYNDXError: true,
				errorText: action.payload
			};
		case POST_SETTINGS_SUCCESS:
			return {
				...state,
				isSavingToYNDX: false,
				isSavingToYNDXError: false,
				errorText: 'Сохранение прошло успешно.',
				isSavedToYNDX: true
			};
		default:
			return state;
	}
};
