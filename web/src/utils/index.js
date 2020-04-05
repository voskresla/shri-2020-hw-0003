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

export const placeholders = {
	repoName: "username/repository",
	buildCommand: "npm run start",
	mainBranch: "branch",
	period: "0"
};

export const mapSettings = (settings) => {
	if (!Object.keys(settings).length) settings = initialSettings

	return Object.keys(settings)
		.filter(key => Object.keys(placeholders).includes(key))
		.map(key => {
			switch (key) {
				case "repoName":
					return {
						id: key,
						label: "Github repository",
						placeholder: placeholders[key],
						value: settings[key],
						required: true,
						pattern: ".+/.+",
						vertical: true
					};
				case "buildCommand":
					return {
						id: key,
						label: "Build Command",
						placeholder: placeholders[key],
						value: settings[key],
						required: true,
						vertical: true
					};
				case "mainBranch":
					return {
						id: key,
						label: "Main Branch",
						placeholder: placeholders[key],
						value: settings[key],
						vertical: true
					};
				case "period":
					return {
						id: key,
						label: "Synchronize every",
						placeholder: placeholders[key],
						value: settings[key],
						type: 'number',
						pattern: '\\d'
					};
				default:
					break;
			}
		})
}