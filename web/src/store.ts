import { createStore, applyMiddleware, compose, Action } from "redux";
import reducers from "./reducers";
import thunk, { ThunkMiddleware } from "redux-thunk";
import { SettingsModel } from "./utils";

export interface SettingsStoreTypes {
	conf: SettingsModel,
	isLoaded: boolean,
	isSavedYNDX: boolean,
	isSavingToYNDX: boolean,
	isSavedToYNDX: boolean,
	isSavingToError: boolean,
	isError: boolean,
	errorText: string,
	isSavingToYNDXError: boolean
}

export enum BuildStatusEnum {
	Waiting = 'Waiting',
	InProgress = 'InProgress',
	Success = 'Success',
	Fail = 'Fail',
	Canceled = 'Canceled'
}

export interface BuildModel {
	id: string
	configurationId: string
	buildNumber: number
	commitMessage: string
	commitHash: string
	branchName: string
	authorName: string
	status: keyof typeof BuildStatusEnum
	start?: string
	duration?: number
}

export interface CurrentBuild {
	build: BuildModel,
	buildLog: string,
	errorText: string,
	logErrorText: string
}

export interface StoreTypes {
	settings: SettingsStoreTypes,
	builds: BuildModel[],
	currentBuild: CurrentBuild
}

declare global {
	interface Window {
		__REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
	}
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(reducers, composeEnhancers(applyMiddleware(thunk as ThunkMiddleware<StoreTypes, Action>)));
