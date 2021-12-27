import { Router, Response, Request, NextFunction } from 'express';
// Models:
import { Deposit } from '../models/deposit.model';
// Services:
import * as depositService from '../services/deposits.service';
// Shared:
import { log } from '../shared/Logger';
import { STATUS_CODES } from 'foodspy-shared';

export { setSpendRoute };

function setSpendRoute(router: Router): Router {
	router.get('/', getDeposits);
	router.get('/:id', getDepositById);
	router.post('/', spendDeposit);
	return router;
}

async function getDeposits(
	req: Request,
	res: Response,
	next: NextFunction
) {
	log('spend.route.ts', getDeposits.name, '');

	const response = await depositService.getDeposits();
	return res.json(response);
}

async function getDepositById(
	req: Request,
	res: Response,
	next: NextFunction
) {
	log('spend.route.ts', getDepositById.name, '');

	const id = req.params.id;

	const response = await depositService.getDepositById(id);
	return res.json(response);
}

async function spendDeposit(
	req: Request,
	res: Response,
	next: NextFunction
) {
	log('spend.route.ts', spendDeposit.name, '');

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

	let response = await depositService.postDeposit(newDeposit);
	return res.status(STATUS_CODES.CREATED).json(response);
}
