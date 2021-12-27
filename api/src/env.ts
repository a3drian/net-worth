import dotenv from 'dotenv';

import { log } from './shared/Logger';

const config = dotenv.config();
log('env.ts', 'global call', `require('dotenv').config():`, config);

import { Constants } from './shared/Constants';

let NODE_ENVIRONMENT: string;
if (Constants.IN_DEBUG_MODE === true) {
	NODE_ENVIRONMENT = Constants.DEVELOPMENT_MODE;
} else {
	NODE_ENVIRONMENT = Constants.PRODUCTION_MODE;
}

const CLUSTER_URI: string = process.env.ENV_MONGO_URI ?
	process.env.ENV_MONGO_URI : '';

export const env = Object.freeze(
	{
		PORT: process.env.PORT || 8008,	// for compatibility with Heroku

		NODE_ENV: NODE_ENVIRONMENT,

		MONGO_URL: CLUSTER_URI,
		DB_NAME: 'NetWorthDb',
		TEST_DB_NAME: 'NetWorthDbTest',

		SAVE_ROUTE: Constants.APIEndpoints.SAVE_URL,
		SPEND_ROUTE: Constants.APIEndpoints.SPEND_URL,
	}
);
