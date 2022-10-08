// Shared:
import { CATEGORY } from './constants/Categories';
import { CURRENCY } from './constants/Currencies';
import { environment as env } from 'src/environments/environment';

export const Constants = Object.freeze({
	IN_DEBUG_MODE: env.IN_DEBUG_MODE,

	appEndpoints: Object.freeze({
		LOGIN_URL: 'login',
		DASHBOARD_URL: 'dashboard',
		POLICY_URL: 'policy'
	}),

	apiEndpoints: Object.freeze({
		SAVE_BASE_URL: '/api/save',
		SPEND_BASE_URL: '/api/spend',
		SEARCH_BY_OWNER_URL: '/owner',
		SEARCH_BY_OWNER_AND_MONTH_URL: '/owner/month'
	}),

	defaultOwner: 'adi@foodspy3.com',

	updateTimeout: 500,

	formDefaults: Object.freeze({
		amount: 10,
		currency: CURRENCY.LEI,
		details: 'Groceries',
		category: CATEGORY.GROCERIES,
		refundable: false,
		refunded: false
	}),

	formPlaceholders: Object.freeze({
		amount: 10,
		currency: CURRENCY.LEI,
		details: 'Groceries...',
		category: CATEGORY.GROCERIES
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
