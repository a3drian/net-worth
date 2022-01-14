// Shared
import { CURRENCIES } from 'net-worth-shared';
import { CATEGORY } from './constants/Categories';
import { CITY } from './constants/Cities';
import { LOCATION } from './constants/Locations';

export const Constants = Object.freeze({
	IN_DEBUG_MODE: true,

	appEndpoints: Object.freeze({
		LOGIN_URL: 'login',
		DASHBOARD_URL: 'dashboard',
		SPEND_URL: 'spend'
	}),

	apiEndpoints: Object.freeze({
		SPEND_BASE_URL: '/api/spend',
		SPEND_SEARCH_URL: '/owner'
	}),

	defaultOwner: 'adi@foodspy2.com',

	updateTimeout: 250,

	formDefaults: Object.freeze({
		amount: 10,
		details: 'Groceries',
		currency: CURRENCIES.LEI,
		exchangeRate: 1,
		recurrent: false,
		category: CATEGORY.GROCERIES,
		location: LOCATION.SELGROS,
		city: CITY.BRASOV,
		frequency: '',
	}),

	formPlaceholders: Object.freeze({
		amount: 10,
		details: 'Groceries...',
	})

});
