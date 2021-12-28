const ObjectId = require('mongoose').Types.ObjectId;
import { STATUS_CODES } from 'foodspy-shared';
// Interfaces:
import { IDeposit } from '../interfaces/IDeposit';
import { IExpressError } from '../interfaces/IExpressError';
// Models:
import { DepositModel } from '../schemas/deposit.schema';
// Shared:
import { log } from '../shared/Logger';

const CLASS_NAME = 'deposits.service.ts';

export {
	getDeposits,
	getDepositById,
	postDeposit,
	// putDeposit,
	// deleteDeposit
};

async function getDeposits(): Promise<Error | IDeposit[]> {
	log(CLASS_NAME, getDeposits.name, '');

	const deposits: IDeposit[] = await DepositModel.find({ amount: 69 });
	return deposits;
}

async function getDepositById(
	id: string
): Promise<Error | IDeposit | null> {

	log(CLASS_NAME, getDepositById.name, '');

	if (!validId(id)) {
		log(CLASS_NAME, `${getDepositById.name}^`, '');

		const err = new Error(`'${id}' is not valid!`) as IExpressError;
		err.status = STATUS_CODES.BAD_REQUEST;
		return err;
	}

	log(CLASS_NAME, getDepositById.name, 'id:', id);

	let deposit: IDeposit | null;

	try {
		deposit = await DepositModel.findById({ _id: id });

		if (deposit === null) {
			log(CLASS_NAME, getDepositById.name, `Deposit '${id}' was not found!`);
			log(CLASS_NAME, `${getDepositById.name}^`, '');

			const notFoundError = new Error(`Deposit '${id}' was not found!`) as IExpressError;
			notFoundError.status = STATUS_CODES.NOT_FOUND;
			return notFoundError;
		}

		log(CLASS_NAME, getDepositById.name, 'deposit:', deposit);
		log(CLASS_NAME, `${getDepositById.name}^`, '');

		return deposit;

	} catch (ex: any) {
		log(CLASS_NAME, getDepositById.name, 'exception caught:', ex.message);
		log(CLASS_NAME, `${getDepositById.name}^`, '');

		return ex;
	}
}

async function postDeposit(
	deposit: Partial<IDeposit>
): Promise<Error | IDeposit> {
	log(CLASS_NAME, postDeposit.name, '');

	try {

		const newDeposit = new DepositModel(deposit);
		console.log('newDeposit:', newDeposit);

		await newDeposit.save();
		return newDeposit;

	} catch (ex: any) {
		log(CLASS_NAME, postDeposit.name, 'exception caught:', ex.message);
		return ex;
	}
}

function validId(id: string): boolean {
	if (ObjectId.isValid(id)) {
		if ((String)(new ObjectId(id)) === id) { return true; }
	}

	log(CLASS_NAME, validId.name, `id '${id}' is not valid!`);
	return false;
}
