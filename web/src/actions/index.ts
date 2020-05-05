// import API
import api from "../api/schoolcicerver";
import { history, SettingsModel } from '../utils'
import { Dispatch, Action } from 'redux'
import { BuildModel, StoreTypes } from "../store";
import { ThunkAction } from 'redux-thunk'
import { AxiosResponse } from 'axios'

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
export const SHOW_MORE = "SHOW_MORE"
export const FETCH_BUILD_BY_NUMBER_ERROR = "FETCH_BUILD_BY_NUMBER_ERROR"
export const FETCH_BUILD_BY_NUMBER_SUCCESS = "FETCH_BUILD_BY_NUMBER_SUCCESS"
export const FETCH_LOG_BY_BUILD_ID_SUCCESS = "FETCH_LOG_BY_BUILD_ID_SUCCESS"
export const FETCH_LOG_BY_BUILD_ID_ERROR = "FETCH_LOG_BY_BUILD_ID_ERROR"
export const CLEAR_CURRENT_BUILD_FROM_REDUX = "CLEAR_CURRENT_BUILD_FROM_REDUX"
export const RUN_REBUILD_BY_HASH = "RUN_REBUILD_BY_HASH"
export const RUN_REBUILD_BY_HASH_ERROR = "RUN_REBUILD_BY_HASH_ERROR"

export const actionsTypeCONST = {
	CLEAR_SETTINGS_FLAGS,
	FETCH_SETTINGS_ERROR,
	SAVE_SETTINGS_TO_REDUX,
	POST_SETTINGS_BEGIN,
	POST_SETTINGS_SUCCESS,
	POST_SETTINGS_ERROR,
	SAVE_BUILDS_TO_REDUX,
	SAVE_CURRENT_BUILD_TO_REDUX,
	FETCH_BUILDS_SUCCESS,
	FETCH_BUILDS_ERROR,
	SHOW_MORE,
	FETCH_BUILD_BY_NUMBER_ERROR,
	FETCH_BUILD_BY_NUMBER_SUCCESS,
	FETCH_LOG_BY_BUILD_ID_SUCCESS,
	FETCH_LOG_BY_BUILD_ID_ERROR,
	CLEAR_CURRENT_BUILD_FROM_REDUX,
	RUN_REBUILD_BY_HASH,
	RUN_REBUILD_BY_HASH_ERROR,
}

interface SettingsModelResponse {
	data: SettingsModel
}
export interface SaveSettingsToReduxAction {
	type: typeof SAVE_SETTINGS_TO_REDUX,
	payload: SettingsModelResponse | SettingsModel
}
export interface FetchSettingError {
	type: typeof FETCH_SETTINGS_ERROR,
}
export const init = (): ThunkAction<void, StoreTypes, unknown, Action<string>> =>
	async (dispatch: Dispatch<FetchSettingError | SaveSettingsToReduxAction>) => {
		try {
			const response = await api.get<{}, AxiosResponse<SettingsModelResponse>>("/settings");
			dispatch({ type: SAVE_SETTINGS_TO_REDUX, payload: response.data });
		} catch (e) {
			dispatch({ type: FETCH_SETTINGS_ERROR })
		}
	}

export const getSettingsFromYNDX = (): ThunkAction<void, StoreTypes, unknown, Action<string>> => async (dispatch: Dispatch<SaveSettingsToReduxAction | FetchSettingError>) => {
	try {
		const response = await api.get<{}, AxiosResponse<SettingsModelResponse>>("/settings");
		dispatch({ type: SAVE_SETTINGS_TO_REDUX, payload: response.data });
	} catch (e) {
		dispatch({ type: FETCH_SETTINGS_ERROR })
	}
};

export interface PostSettings {
	type: typeof POST_SETTINGS_BEGIN | typeof POST_SETTINGS_SUCCESS | typeof POST_SETTINGS_ERROR
	payload?: { message: string } | string
}
export const saveSettingsToYNDX =
	(settings: SettingsModel): ThunkAction<void, StoreTypes, unknown, Action<string>> =>
		async (dispatch: Dispatch<PostSettings | SaveSettingsToReduxAction>) => {

			dispatch({ type: POST_SETTINGS_BEGIN });
			try {
				const response = await api.post<{}, AxiosResponse<{ message: string }>>("/settings", settings);
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


export interface FetchBuilds {
	type: typeof FETCH_BUILDS_SUCCESS | typeof FETCH_BUILDS_ERROR | typeof SHOW_MORE
	payload?: BuildModel[]
}
export const getBuildsListFromYNDX = (limit?: number, offset?: number): ThunkAction<void, StoreTypes, unknown, Action<string>> => async (dispatch: Dispatch<FetchBuilds>) => {
	try {
		const response = await api.get<{}, AxiosResponse<BuildModel[]>>(`/builds`, { params: { offset, limit } })

		if (offset) return dispatch({ type: SHOW_MORE, payload: response.data })

		dispatch({ type: FETCH_BUILDS_SUCCESS, payload: response.data })
	} catch (e) {
		dispatch({ type: FETCH_BUILDS_ERROR })
	}
}

export interface FetchBuildByNumber {
	type: typeof FETCH_BUILD_BY_NUMBER_ERROR | typeof FETCH_BUILD_BY_NUMBER_SUCCESS
	payload: any
}
type FetchBuildByNumberResponse = {
	data: BuildModel
	id: string
	message: string
}
export interface FetchLogById {
	type: typeof FETCH_LOG_BY_BUILD_ID_ERROR | typeof FETCH_LOG_BY_BUILD_ID_SUCCESS
	payload: any
}
interface FetchLogByIdResponse {
	data: any // TODO: взять из модельки FinishBuildInput: BuildLog когда дойдешь до нее
	message: string
}
export const getCurrentBuildByNumber = (number: BuildModel['buildNumber'] | string): ThunkAction<void, StoreTypes, unknown, Action<string>> => async (dispatch: Dispatch<FetchBuildByNumber | FetchLogById>) => {
	if (number === undefined) return

	try {
		const response = await api.get<{}, AxiosResponse<any>>(`/builds/${number}`)
		if (response.status === 200 && response.statusText !== 'OK') {
			dispatch({ type: FETCH_BUILD_BY_NUMBER_ERROR, payload: response.data });
			return
		}
		dispatch({ type: FETCH_BUILD_BY_NUMBER_SUCCESS, payload: response.data })

		const buildId = response.data.id
		const log = await api.get<{}, AxiosResponse<any>>(`/builds/${buildId}/logs`)
		if (log.status === 200 && log.statusText !== 'OK') {
			dispatch({ type: FETCH_LOG_BY_BUILD_ID_ERROR, payload: log.data });
			return
		}

		dispatch({ type: FETCH_LOG_BY_BUILD_ID_SUCCESS, payload: log.data })
		return
	} catch (e) {
		dispatch({ type: FETCH_BUILD_BY_NUMBER_ERROR, payload: 'Что-то пошло не так на сервере' });
	}
}

export interface clearCurrentBuild {
	type: typeof CLEAR_CURRENT_BUILD_FROM_REDUX
}
export const clearCurrentBuildFlags = () => {
	return {
		type: CLEAR_CURRENT_BUILD_FROM_REDUX,
	};
}

export interface RunRebuild {
	type: typeof RUN_REBUILD_BY_HASH_ERROR
	payload: any
}
interface RunRebuildResponse {
	data: BuildModel
	message: string
}
export const runRebuild = (hash?: BuildModel['commitHash']): ThunkAction<void, StoreTypes, unknown, Action<string>> => async (dispatch: Dispatch<RunRebuild | FetchBuildByNumber>) => {
	try {
		const response = await api.post<{}, AxiosResponse<RunRebuildResponse>>(`/builds/${hash}`).catch(e => { throw new Error() })
		if (response.status === 200 && response.statusText !== 'OK') {
			dispatch({ type: RUN_REBUILD_BY_HASH_ERROR, payload: response.data });
			return
		}

		history.push(`/build/${response.data.data.buildNumber}`)

	} catch (e) {
		dispatch({ type: FETCH_BUILD_BY_NUMBER_ERROR, payload: 'Что-то пошло не так на сервере' });
	}
}





