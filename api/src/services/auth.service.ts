// Express:
import { Request, Response, NextFunction } from 'express';
// Firebase:
import * as admin from 'firebase-admin';
import { DecodedIdToken } from 'firebase-admin/auth';
import { env } from '../env';
// Shared:
import { log } from '../shared/Logger';

export { verifyJWT };

async function verifyJWT(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<any> {
	try {
		const authHeader = req.headers['authorization'];
		if (!authHeader) {
			return res.sendStatus(401);
		}

		const bearer = authHeader.split(' ');
		const token = bearer[1];
		log('verifyJWT.ts', verifyJWT.name, 'token:', token);

		if (!token) {
			return res.sendStatus(401);
		}

		if (admin.apps.length === 0) {
			admin.initializeApp({
				credential: admin.credential.cert(env.SERVICE_ACCOUNT),
				projectId: 'spendit-app',
			});
		}

		const payload: DecodedIdToken = await admin
			.auth()
			.verifyIdToken(token, true);

		if (payload) {
			log('verifyJWT.ts', verifyJWT.name, 'payload:', payload);
			next();
		}
	} catch (err) {
		// received a token, but something about it was not right, aka. invalid token
		log('verifyJWT.ts', verifyJWT.name, 'err:', err);
		return res.sendStatus(403);
	}
}
