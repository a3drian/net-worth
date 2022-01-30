// Shared:
import { CATEGORY } from './constants/Categories';

export const Constants = Object.freeze({
	IN_DEBUG_MODE: true,

	appEndpoints: Object.freeze({
		LOGIN_URL: 'login',
		DASHBOARD_URL: 'dashboard'
	}),

	apiEndpoints: Object.freeze({
		SAVE_BASE_URL: '/api/save',
		SPEND_BASE_URL: '/api/spend',
		SEARCH_URL: '/owner'
	}),

	defaultOwner: 'adi@foodspy3.com',

	updateTimeout: 500,

	formDefaults: Object.freeze({
		amount: 10,
		details: 'Groceries',
		category: CATEGORY.GROCERIES,
		location: 'Selgros',
		city: 'Brașov'
	}),

	formPlaceholders: Object.freeze({
		amount: 10,
		details: 'Groceries...',
		category: CATEGORY.GROCERIES,
		location: 'Selgros...',
		city: 'Brașov...'
	}),

	dialogDimensions: Object.freeze({
		width: '320px'
	}),

	amountErrors: Object.freeze({
		empty: 'Please add the amount',
		invalidCharacters: 'Please use only digits and decimal points',
		invalidDecimalSeparator: `Please use '.' (decimal point) for fractional values`,
		negativeValue: 'Please add a positive value'
	}),

	detailsErrors: Object.freeze({
		empty: 'Please add some details',
		tooLong: 'Please use fewer characters'
	}),

});
