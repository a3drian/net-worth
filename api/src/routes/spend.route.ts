import { Router, Response, Request, NextFunction } from 'express';
// Models:
import { IDeposit } from 'net-worth-shared';
import { Deposit } from '../models/deposit.model';
import { SearchOption } from '../models/search.model';
// Services:
import * as depositService from '../services/deposits.service';
// Shared:
import { log } from '../shared/Logger';
import { STATUS_CODES } from 'net-worth-shared';

const CLASS_NAME = 'spend.route.ts';

export { setSpendRoute };

function setSpendRoute(router: Router): Router {
	router.get('/:id', getDepositById);
	router.post('/owner/', getDepositsByOwner);
	router.post('/', postDeposit);
	router.put('/:id', putDeposit);
	router.delete('/:id', deleteDeposit);
	return router;
}

async function getDepositById(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<IDeposit | void | any> {
	console.log('');

	const id = req.params.id;

	let response: Error | IDeposit;
	try {
		response = await depositService.getDepositById(id);
	} catch (ex) {
		return next(ex);
	}

	if (response instanceof Error) { return next(response); }

	return res
		.status(STATUS_CODES.OK)
		.json(response)
		.end();
}

async function getDepositsByOwner(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<IDeposit[] | void | any> {
	console.log('');

	const body = req.body;
	log(CLASS_NAME, getDepositsByOwner.name, 'body:', body);

	const searchQuery = new SearchOption({ owner: body.owner });

	let response: Error | IDeposit[];
	try {
		response = await depositService.getDepositsByOwner(searchQuery);
	} catch (ex) {
		return next(ex);
	}

	if (response instanceof Error) { return next(response); }

	return res
		.status(STATUS_CODES.OK)
		.json(response)
		.end();
}

async function postDeposit(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<IDeposit | void | any> {
	console.log('');

	const body = req.body;
	console.log(CLASS_NAME, postDeposit.name, 'body:', body);

	const newDeposit = new Deposit(
		{
			owner: body.owner,
			amount: body.amount,
			currency: body.currency,
			details: body.details,
			createdAt: body.createdAt,
			category: body.category,
			refundable: body.refundable,
			refunded: body.refunded
		}
	);

	let response: Error | IDeposit;
	try {
		response = await depositService.postDeposit(newDeposit);
	} catch (ex) {
		return next(ex);
	}

	if (response instanceof Error) { return next(response); }

	return res
		.status(STATUS_CODES.CREATED)
		.json(response)
		.end();
}

async function putDeposit(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<IDeposit | void | any> {
	console.log('');

	const id = req.params.id;
	const body = req.body;

	console.log(CLASS_NAME, putDeposit.name, 'body:', body);

	const editedDeposit = new Deposit(
		{
			owner: body.owner,
			amount: body.amount,
			currency: body.currency,
			details: body.details,
			createdAt: body.createdAt,
			category: body.category,
			refundable: body.refundable,
			refunded: body.refunded
		}
	);

	let response: Error | IDeposit;
	try {
		response = await depositService.putDeposit(id, editedDeposit);
	} catch (ex) {
		return next(ex);
	}

	if (response instanceof Error) { return next(response); }

	return res
		.status(STATUS_CODES.OK)
		.json(response)
		.end();
}

async function deleteDeposit(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void | any> {
	console.log('');

	const id = req.params.id;

	let response: Error | IDeposit;
	try {
		response = await depositService.deleteDeposit(id);
	} catch (ex) {
		return next(ex);
	}

	if (response instanceof Error) { return next(response); }

	return res
		.status(STATUS_CODES.OK)
		.json(response)
		.end();
}
