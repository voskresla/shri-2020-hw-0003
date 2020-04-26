import {
	CLEAR_SETTINGS_FLAGS,
	FETCH_SETTINGS_ERROR,
	SAVE_SETTINGS_TO_REDUX,
	POST_SETTINGS_BEGIN,
	POST_SETTINGS_SUCCESS,
	POST_SETTINGS_ERROR,
} from "../actions";
import { SettingsModel } from "../utils";
import { SettingsStoreTypes } from "../store";

// TODO:  refactor initialSettingState
const initialSettingsState = {
	conf: {},
	isLoaded: false,
	isSavedYNDX: false,
	isSavingToYNDX: false,
	isSavedToYNDX: false,
	isSavingToError: false,
	isError: false,
	errorText: '',
}

export default (state = initialSettingsState, action: { type: any; payload: any; }) => {
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
		case CLEAR_SETTINGS_FLAGS:
			return {
				...state,
				isSavingToYNDX: false,
				isSavingToYNDXError: false,
				errorText: '',
				isSavedToYNDX: false
			};
		default:
			return state;
	}
};
