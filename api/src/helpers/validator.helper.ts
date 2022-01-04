const ObjectId = require('mongoose').Types.ObjectId;
// Interfaces:
import { IDeposit } from 'net-worth-shared';
import { ISearchOption } from 'net-worth-shared';
// Shared:
import { log } from '../shared/Logger';

const CLASS_NAME = 'validator.helper.ts';

export function validId(id: string): boolean {
	if (ObjectId.isValid(id)) {
		if ((String)(new ObjectId(id)) === id) { return true; }
	}

	log(CLASS_NAME, validId.name, `id '${id}' is not valid!`);
	return false;
}

export function validDeposit(deposit: Partial<IDeposit>): boolean {
	if (
		!deposit ||
		typeof deposit !== 'object' ||
		!deposit.owner ||
		!deposit.amount ||
		!deposit.currency ||
		!deposit.createdAt ||
		!deposit.exchangeRate
	) {
		log(CLASS_NAME, validId.name, `partial deposit is not valid!`);
		return false;
	}

	return true;
}

export function validSearchQuery(searchQuery: ISearchOption): boolean {
	if (
		!searchQuery ||
		typeof searchQuery !== 'object' ||
		!searchQuery.owner
	) {
		log(CLASS_NAME, validSearchQuery.name, `search query is not valid!`);
		return false;
	}

	return true;
}

export function validOldDeposit(id: string, deposit: Partial<IDeposit>): boolean {
	if (validDeposit(deposit)) {
		console.log('DEPOSIT:', deposit)
		if (id === (String)(new ObjectId(deposit._id))) {
			return true;
		}
	}

	log(CLASS_NAME, validId.name, `old deposit (with id) is not valid!`);
	return false;
}
