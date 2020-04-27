import { SettingsModel } from './../routes/settings'

export const isValidConfigarationSettings = (settings: SettingsModel): boolean => {
	const { repoName, buildCommand, mainBranch, period } = settings
	if (typeof repoName !== 'string' || repoName.split('/').length !== 2) {
		return false
	}
	if (typeof repoName !== 'string' || buildCommand.length === 0) {
		return false
	}
	if (typeof mainBranch !== 'string' || buildCommand.length === 0) {
		return false
	}
	if (typeof period !== 'number') {
		return false
	}
	return true
}
