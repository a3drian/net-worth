import { Router, Response, Request, NextFunction } from 'express';
// Models:
import { IDeposit } from '../interfaces/IDeposit';
import { Deposit } from '../models/deposit.model';
// Services:
import * as depositService from '../services/deposits.service';
// Shared:
import { STATUS_CODES } from 'foodspy-shared';

const CLASS_NAME = 'spend.route.ts';

export { setSpendRoute };

function setSpendRoute(router: Router): Router {
	router.get('/', getDeposits);
	router.get('/:id', getDepositById);
	router.post('/', spendDeposit);
	// router.put('/', putDeposit);
	// router.delete('/', deleteDeposit);
	return router;
}

async function getDeposits(
	req: Request,
	res: Response,
	next: NextFunction
) {
	console.log('');

	const response = await depositService.getDeposits();
	return res.json(response);
}

async function getDepositById(
	req: Request,
	res: Response,
	next: NextFunction
) {
	console.log('');

	const id = req.params.id;

	let response: Error | IDeposit | null;

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

async function spendDeposit(
	req: Request,
	res: Response,
	next: NextFunction
) {
	console.log('');

	const body = req.body;
	console.log('body:', body);

	const newDeposit = new Deposit(
		{
			amount: body.amount,
			currency: body.currency,
			createdAt: body.createdAt,
			exchangeRate: body.exchangeRate
		}
	);

	const response = await depositService.postDeposit(newDeposit);
	return res.status(STATUS_CODES.CREATED).json(response);
}
