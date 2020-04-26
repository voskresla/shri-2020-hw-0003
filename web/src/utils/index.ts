import { withNaming } from "@bem-react/classname";
import { createBrowserHistory } from "history";

export const cn = withNaming({ e: "__", m: "_" });
export const history = createBrowserHistory();

export const initialSettings = {
	repoName: "",
	buildCommand: "",
	mainBranch: "",
	period: "",
};

export const placeholders: Placeholder = {
	repoName: "username/repository",
	buildCommand: "npm run start",
	mainBranch: "branch",
	period: "0"
};

export interface Placeholder {
	repoName: "username/repository",
	buildCommand: "npm run start",
	mainBranch: "branch",
	period: "0"
}

export interface SettingsModel {
	repoName: string
	buildCommand: string
	mainBranch: string
	period: string | number
}

export enum InputLabels {
	"Github repository",
	"Build Command",
	"Main Branch",
	"Synchronize every"
}

export interface MapSettings {
	id: string,
	label: keyof typeof InputLabels,
	placeholder: string,
	value: string | number,
	required?: boolean,
	pattern?: string,
	vertical?: boolean,
	type?: string
}

export const mapSettings = (settings: SettingsModel): Array<MapSettings | undefined> => {
	if (!Object.keys(settings).length) settings = initialSettings

	return Object.keys(settings)
		.filter(key => Object.keys(placeholders).includes(key))
		.map(key => {
			switch (key) {
				case "repoName":
					return {
						id: key,
						label: "Github repository",
						placeholder: placeholders[key as keyof Placeholder],
						value: settings[key as keyof SettingsModel],
						required: true,
						pattern: ".+/.+",
						vertical: true
					};
				case "buildCommand":
					return {
						id: key,
						label: "Build Command",
						placeholder: placeholders[key as keyof Placeholder],
						value: settings[key as keyof SettingsModel],
						required: true,
						vertical: true
					};
				case "mainBranch":
					return {
						id: key,
						label: "Main Branch",
						placeholder: placeholders[key as keyof Placeholder],
						value: settings[key as keyof SettingsModel],
						vertical: true
					};
				case "period":
					return {
						id: key,
						label: "Synchronize every",
						placeholder: placeholders[key as keyof Placeholder],
						value: settings[key as keyof SettingsModel],
						type: 'number',
						pattern: '\\d'
					};
				default:
					break;
			}
		})
}
