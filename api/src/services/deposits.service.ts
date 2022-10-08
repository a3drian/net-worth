// Helpers:
import { validDeposit, validId, validSearchQuery, validOldDeposit } from '../helpers/validator.helper';
// Interfaces:
import { IDeposit } from 'net-worth-shared';
import { IExpressError } from 'net-worth-shared';
// Models:
import { DepositModel } from '../schemas/deposit.schema';
import { SearchQuerySort, SearchQueryMonthSort, SortOption, SORT_OPTION } from '../models/search.model';
// Shared:
import { log } from '../shared/Logger';
import { STATUS_CODES } from 'net-worth-shared';

const CLASS_NAME = 'deposits.service.ts';

export {
	getDepositById,
	getDepositsByOwner,
	getDepositsByOwnerAndCurrentMonth,
	postDeposit,
	putDeposit,
	deleteDeposit
};

function sort(deposits: IDeposit[], sortOption: SortOption): IDeposit[] {
	deposits.sort((a: IDeposit, b: IDeposit) => {
		const date1 = Number(new Date(a.createdAt));
		const date2 = Number(new Date(b.createdAt));
		return date1 - date2;
	});

	if (sortOption === SORT_OPTION.DESC) {
		deposits.reverse();
	}

	return deposits;
}

async function getDepositById(
	id: string
): Promise<Error | IDeposit> {

	log(CLASS_NAME, getDepositById.name, '');

	if (!validId(id)) { return throwError(getDepositById.name, `'${id}' is not valid!`, STATUS_CODES.BAD_REQUEST); }

	log(CLASS_NAME, getDepositById.name, 'id:', id);

	try {

		const deposit: IDeposit | null = await DepositModel.findById({ _id: id });

		if (deposit === null) { return throwError(getDepositById.name, `Deposit '${id}' was not found!`, STATUS_CODES.NOT_FOUND); }

		log(CLASS_NAME, getDepositById.name, 'deposit:', deposit);
		log(CLASS_NAME, `${getDepositById.name}^`, '');

		return deposit;

	} catch (ex: any) { return throwError(putDeposit.name, `exception caught: ${ex.message}`, STATUS_CODES.SERVER_ERROR); }
}

async function getDepositsByOwner(
	searchQuery: SearchQuerySort
): Promise<Error | IDeposit[]> {

	log(CLASS_NAME, getDepositsByOwner.name, '');

	if (!validSearchQuery(searchQuery)) { return throwError(getDepositsByOwner.name, 'Invalid POST/:owner parameters!', STATUS_CODES.BAD_REQUEST); }

	try {

		const deposits: IDeposit[] = await DepositModel.find({ owner: searchQuery.owner });
		sort(deposits, searchQuery.sort);

		log(CLASS_NAME, getDepositsByOwner.name, 'deposits:', deposits);
		log(CLASS_NAME, `${getDepositsByOwner.name}^`, '');

		return deposits;

	} catch (ex: any) { return throwError(putDeposit.name, `exception caught: ${ex.message}`, STATUS_CODES.SERVER_ERROR); }
}

async function getDepositsByOwnerAndCurrentMonth(
	searchQuery: SearchQueryMonthSort
): Promise<Error | IDeposit[]> {

	log(CLASS_NAME, getDepositsByOwnerAndCurrentMonth.name, '');

	if (!validSearchQuery(searchQuery)) { return throwError(getDepositsByOwnerAndCurrentMonth.name, 'Invalid POST/:owner parameters!', STATUS_CODES.BAD_REQUEST); }

	try {

		const deposits: IDeposit[] = (await DepositModel.find({ owner: searchQuery.owner })).filter(d => d.createdAt.getMonth() === searchQuery.currentMonth);
		sort(deposits, searchQuery.sort);

		log(CLASS_NAME, getDepositsByOwnerAndCurrentMonth.name, 'deposits:', deposits);
		log(CLASS_NAME, `${getDepositsByOwnerAndCurrentMonth.name}^`, '');

		return deposits;

	} catch (ex: any) { return throwError(putDeposit.name, `exception caught: ${ex.message}`, STATUS_CODES.SERVER_ERROR); }
}

async function postDeposit(
	deposit: Partial<IDeposit>
): Promise<Error | IDeposit> {

	log(CLASS_NAME, postDeposit.name, '');

	if (!validDeposit(deposit)) { return throwError(postDeposit.name, 'Invalid POST parameters!', STATUS_CODES.BAD_REQUEST); }

	try {

		const newDeposit = new DepositModel(deposit);

		log(CLASS_NAME, postDeposit.name, 'newDeposit:', newDeposit);
		log(CLASS_NAME, `${postDeposit.name}^`, '');

		await newDeposit.save();
		return newDeposit;

	} catch (ex: any) { return throwError(putDeposit.name, `exception caught: ${ex.message}`, STATUS_CODES.SERVER_ERROR); }
}

async function putDeposit(
	id: string,
	deposit: Partial<IDeposit>
): Promise<Error | IDeposit> {

	log(CLASS_NAME, putDeposit.name, '');

	try {

		const updatedDeposit = await DepositModel
			.findByIdAndUpdate(
				id,
				deposit,
				{ new: true }
			);

		if (updatedDeposit === null) { return throwError(putDeposit.name, `Deposit '${id}' failed to update!`, STATUS_CODES.BAD_REQUEST); }

		if (!validOldDeposit(id, updatedDeposit)) { return throwError(putDeposit.name, 'Invalid PUT parameters!', STATUS_CODES.BAD_REQUEST); }

		log(CLASS_NAME, putDeposit.name, 'updatedDeposit:', updatedDeposit);
		log(CLASS_NAME, `${putDeposit.name}^`, '');

		return updatedDeposit;

	} catch (ex: any) { return throwError(putDeposit.name, `exception caught: ${ex.message}`, STATUS_CODES.SERVER_ERROR); }
}

async function deleteDeposit(
	id: string
): Promise<Error | IDeposit> {

	log(CLASS_NAME, deleteDeposit.name, '');

	if (!validId(id)) { return throwError(deleteDeposit.name, `'${id}' is not valid!`, STATUS_CODES.BAD_REQUEST); }

	log(CLASS_NAME, deleteDeposit.name, 'id:', id);

	try {

		const deposit: IDeposit | null = await DepositModel.findByIdAndDelete({ _id: id });

		if (deposit === null) { return throwError(deleteDeposit.name, `Deposit '${id}' was not found and could not be deleted!`, STATUS_CODES.NOT_FOUND); }

		log(CLASS_NAME, deleteDeposit.name, 'deposit:', deposit);
		log(CLASS_NAME, `${deleteDeposit.name}^`, '');

		return deposit;

	} catch (ex: any) { return throwError(putDeposit.name, `exception caught: ${ex.message}`, STATUS_CODES.SERVER_ERROR); }
}

function throwError(origin: string, message: string, statusCode: STATUS_CODES) {
	log(CLASS_NAME, origin, message);
	log(CLASS_NAME, `${origin}^`, '');

	const err = new Error(message) as IExpressError;
	err.status = statusCode;
	return err;
}
