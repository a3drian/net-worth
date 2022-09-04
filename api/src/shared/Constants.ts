const SAVE_URL = '/api/save';
const SPEND_URL = '/api/spend';
const HEALTH_CHECK_URL = '/health';

export { Constants };

class Constants {
	static IN_DEBUG_MODE: boolean = true;
	static APIEndpoints =
		{
			SAVE_URL: SAVE_URL,
			SPEND_URL: SPEND_URL,
			HEALTH_CHECK_URL: HEALTH_CHECK_URL
		};

	static PRODUCTION_MODE: string = 'production';
	static DEVELOPMENT_MODE: string = 'development';
}
