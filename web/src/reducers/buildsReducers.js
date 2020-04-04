import {
	FETCH_BUILDS_SUCCESS,
	FETCH_BUILDS_ERROR,
	FETCH_BUILD_BY_NUMBER_ERROR,
	FETCH_BUILD_BY_NUMBER_SUCCESS,
	FETCH_LOG_BY_BUILD_ID_ERROR,
	FETCH_LOG_BY_BUILD_ID_SUCCESS,
	CLEAR_CURRENT_BUILD_FROM_REDUX
} from "../actions/";

const initialBuildListState = [];
const initialCurrentBuild = {
	build: {},
	buildLog: '',
	errorText: '',
	logErrorText: ''
}

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
			return {
				...state,
				build: action.payload
			}
		case FETCH_BUILDS_ERROR:
			return {
				...state,
				errorText: 'Не могу загрузить сборки.'
			}
		case FETCH_BUILD_BY_NUMBER_ERROR:
			return {
				...state,
				errorText: action.payload
			}
		case FETCH_BUILD_BY_NUMBER_SUCCESS:
			return {
				...state,
				build: { ...action.payload },
				errorText: ''
			}
		case FETCH_LOG_BY_BUILD_ID_ERROR:
			return {
				...state,
				logErrorText: action.payload
			}
		case FETCH_LOG_BY_BUILD_ID_SUCCESS:
			return {
				...state,
				buildLog: action.payload
			}
		case CLEAR_CURRENT_BUILD_FROM_REDUX:
			return {
				...initialCurrentBuild
			}

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
