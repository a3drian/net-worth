// Heroku:
import mongoose from 'mongoose';
import cors from 'cors';
import sslRedirect from 'heroku-ssl-redirect';
// Express:
import express from 'express';
import { Application, Router, Request, Response, NextFunction } from 'express';
// Environment:
import { env } from './env';
// Interfaces:
import { IExpressError } from 'net-worth-shared';
// Routes:
import { setSpendRoute } from './routes/spend.route';
// Shared:
import { Constants } from './shared/Constants';
import { ERROR_MESSAGES, STATUS_CODES } from 'foodspy-shared';
import { log } from './shared/Logger';

let app: Application;

async function makeApp(): Promise<Application> {
	if (app) { return app; }

	app = express();
	app.use(cors());

	app.use(sslRedirect());

	// only when deploying app
	/*
	app.use(express.static('build'));
	app.get(
		'/*',
		function (_req: Request, res: Response) {
			const frontendPath = path.join(__dirname, '../');
			// log('app.ts', makeApp.name, 'frontendPath:', frontendPath);
			const indexPath: string = path.join(frontendPath + '/build/index.html');
			// log('app.ts', makeApp.name, 'indexPath:', indexPath);
			res.sendFile(indexPath);
		}
	);
	*/

	const url = `${env.MONGO_URL}${env.TEST_DB_NAME}?retryWrites=true&w=majority`;
	const db = await mongoose.connect(url);

	log('app.ts', makeApp.name, 'env:', env);

	// middleware
	app.use(express.urlencoded({ extended: false }));
	app.use(express.json());

	// routes
	app.use(env.SPEND_ROUTE, setSpendRoute(Router()));

	// 404
	app.use(
		(_req: Request, _res: Response, next: NextFunction) => {
			const err = new Error(ERROR_MESSAGES.NOT_FOUND) as IExpressError;
			err.status = STATUS_CODES.NOT_FOUND;
			next(err);
		}
	);

	// 500
	app.use(
		(err: IExpressError, _req: Request, res: Response, _next: NextFunction) => {
			res
				.status(err.status || STATUS_CODES.SERVER_ERROR)
				.send(env.NODE_ENV === Constants.PRODUCTION_MODE ? {} : { 'status': err.status, 'message': err.message });
		}
	);

	return app;
}

export { makeApp };
