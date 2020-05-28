import { StoreTypes } from '../store'
import { CHANGE_LOCALE } from '../actions/index'

const initialLocaleState: StoreTypes['locale'] = {
	locale: 'Ru'
}

const toggleLocale = (locale: string) => {
	return locale === 'Ru' ? 'En' : 'Ru'
}

export default (state = initialLocaleState, action: { type: any; payload: any; }): StoreTypes['locale'] => {
	console.log('fire locale reducer 1')
	switch (action.type) {
		case CHANGE_LOCALE:
			console.log('fire locale reducer 2')
			return {
				...state,
				locale: toggleLocale(state.locale)
			};
		default:
			return state;
	}
}
