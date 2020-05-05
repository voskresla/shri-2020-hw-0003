import {
	FETCH_BUILDS_SUCCESS,
	FETCH_BUILDS_ERROR,
	FETCH_BUILD_BY_NUMBER_ERROR,
	FETCH_BUILD_BY_NUMBER_SUCCESS,
	FETCH_LOG_BY_BUILD_ID_ERROR,
	FETCH_LOG_BY_BUILD_ID_SUCCESS,
	CLEAR_CURRENT_BUILD_FROM_REDUX,
	RUN_REBUILD_BY_HASH_ERROR,
	SHOW_MORE,
	FetchLogById,
	RunRebuild,

} from "../actions";

import { FetchBuilds, FetchBuildByNumber, clearCurrentBuild } from '../actions'
import { StoreTypes, BuildModel, CurrentBuild, BuildStatusEnum } from "../store";


const initialBuildListState: BuildModel[] = [];
const initialCurrentBuild: { build: BuildModel, buildLog: string, errorText: string, logErrorText: string } = {
	build: {
		id: '',
		configurationId: '',
		buildNumber: 0,
		commitMessage: '',
		commitHash: '',
		branchName: '',
		authorName: '',
		status: 'Waiting',
		start: '',
		duration: 0,
	},
	buildLog: '',
	errorText: '',
	logErrorText: ''
}

export const buildsList = (state = initialBuildListState, action: FetchBuilds): StoreTypes['builds'] => {
	switch (action.type) {
		case FETCH_BUILDS_SUCCESS:
			if (action.payload) return [...action.payload]
		case SHOW_MORE:
			if (action.payload) return [...state, ...action.payload]
		default:
			return state;
	}
};

export const currentBuild = (
	state = initialCurrentBuild,
	action: FetchBuilds | FetchBuildByNumber | FetchLogById | clearCurrentBuild | RunRebuild
): StoreTypes['currentBuild'] => {
	switch (action.type) {
		// case FETCH_BUILDS_SUCCESS:
		// 		return {
		// 			...state,
		// 			build: action.payload 
		// 		}
		case FETCH_BUILDS_ERROR:
			return {
				...state,
				errorText: 'Не могу загрузить сборки.'
			}
		case FETCH_BUILD_BY_NUMBER_ERROR:
			return {
				...state,
				errorText: action.payload.message
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
				logErrorText: action.payload.message
			}
		case FETCH_LOG_BY_BUILD_ID_SUCCESS:
			return {
				...state,
				buildLog: action.payload
			}
		case CLEAR_CURRENT_BUILD_FROM_REDUX:
			return {
				...state,
				...initialCurrentBuild
			}
		case RUN_REBUILD_BY_HASH_ERROR:
			return {
				...state,
				errorText: action.payload
			}
		default:
			return state;
	}
};
