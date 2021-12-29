// Helpers:
import { validDeposit, validId, validSearchQuery } from '../helpers/validator.helper';
// Interfaces:
import { IDeposit } from '../interfaces/IDeposit';
import { IExpressError } from '../interfaces/IExpressError';
import { ISearchOption } from '../interfaces/ISearchOption';
// Models:
import { DepositModel } from '../schemas/deposit.schema';
// Shared:
import { STATUS_CODES } from 'foodspy-shared';
import { log } from '../shared/Logger';

const CLASS_NAME = 'deposits.service.ts';

export {
	getDepositById,
	getDepositsByOwner,
	postDeposit,
	// putDeposit,
	// deleteDeposit
};

async function getDepositById(
	id: string
): Promise<Error | IDeposit | null> {

	log(CLASS_NAME, getDepositById.name, '');

	if (!validId(id)) {
		log(CLASS_NAME, `${getDepositById.name}^`, '');

		const badRequestError = new Error(`'${id}' is not valid!`) as IExpressError;
		badRequestError.status = STATUS_CODES.BAD_REQUEST;
		return badRequestError;
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

async function getDepositsByOwner(
	searchQuery: ISearchOption
): Promise<Error | IDeposit[]> {

	log(CLASS_NAME, getDepositsByOwner.name, '');

	if (!validSearchQuery(searchQuery)) {
		log(CLASS_NAME, `${getDepositsByOwner.name}^`, '');

		const badRequestError = new Error('Invalid parameters!') as IExpressError;
		badRequestError.status = STATUS_CODES.BAD_REQUEST;
		return badRequestError;
	}

	try {

		const deposits: IDeposit[] = await DepositModel.find({ owner: searchQuery.owner });

		log(CLASS_NAME, getDepositsByOwner.name, 'deposits:', deposits);
		log(CLASS_NAME, `${getDepositsByOwner.name}^`, '');

		return deposits;

	} catch (ex: any) {
		log(CLASS_NAME, getDepositsByOwner.name, 'exception caught:', ex.message);
		log(CLASS_NAME, `${getDepositsByOwner.name}^`, '');

		return ex;
	}
}

async function postDeposit(
	deposit: Partial<IDeposit>
): Promise<Error | IDeposit> {

	log(CLASS_NAME, postDeposit.name, '');

	if (!validDeposit(deposit)) {
		log(CLASS_NAME, `${postDeposit.name}^`, '');

		const badRequestError = new Error('Invalid parameters!') as IExpressError;
		badRequestError.status = STATUS_CODES.BAD_REQUEST;
		return badRequestError;
	}

	try {

		const newDeposit = new DepositModel(deposit);

		log(CLASS_NAME, postDeposit.name, 'newDeposit:', newDeposit);
		log(CLASS_NAME, `${postDeposit.name}^`, '');

		await newDeposit.save();
		return newDeposit;

	} catch (ex: any) {
		log(CLASS_NAME, postDeposit.name, 'exception caught:', ex.message);
		log(CLASS_NAME, `${postDeposit.name}^`, '');

		return ex;
	}
}
