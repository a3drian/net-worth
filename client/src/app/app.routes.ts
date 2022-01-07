import { Constants } from './shared/Constants';

export interface AppRoute {
	path: string;
	active?: boolean;
}

export const appRoutes = Object.freeze({
	login: <AppRoute>{ path: Constants.appEndpoints.LOGIN_URL },
	dashboard: <AppRoute>{ path: Constants.appEndpoints.DASHBOARD_URL },
	spend: <AppRoute>{ path: Constants.appEndpoints.SPEND_URL },
	view: <AppRoute>{ path: Constants.appEndpoints.VIEW_URL }
});
