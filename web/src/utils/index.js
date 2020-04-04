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
	repoName: "default placeholder",
	buildCommand: "default build command",
	mainBranch: "default MainBranch",
	period: "0"
};

export const mapSettings = (settings) => {
	if (!Object.keys(settings).length) settings = initialSettings
	
	return Object.keys(settings)
		.filter(key => key !== "id")
		.map(key => {
			switch (key) {
				case "repoName":
					return {
						id: key,
						label: "Github repository",
						placeholder: placeholders[key],
						value: settings[key]
					};
				case "buildCommand":
					return {
						id: key,
						label: "Build Command",
						placeholder: placeholders[key],
						value: settings[key]
					};
				case "mainBranch":
					return {
						id: key,
						label: "Main Branch",
						placeholder: placeholders[key],
						value: settings[key]
					};
				case "period":
					return {
						id: key,
						label: "Synchronize every",
						placeholder: placeholders[key],
						value: settings[key]
					};
				default:
					break;
			}
		})
}