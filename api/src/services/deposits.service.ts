// Interfaces:
import { IDeposit } from '../interfaces/IDeposit';
// Models:
import { DepositModel } from '../models/deposit.model';
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

	const deposits: IDeposit[] = [];
	return deposits;
}

async function getDepositById(
	id: string
): Promise<Error | IDeposit | null> {
	log(CLASS_NAME, getDepositById.name, '');

	const deposit: IDeposit = <IDeposit>{};
	return deposit;
}

async function postDeposit(
	deposit: Partial<IDeposit>
) {
	log(CLASS_NAME, postDeposit.name, '');

	try {

		const newDeposit = new DepositModel(deposit);
		console.log('newDeposit:', newDeposit);

		await newDeposit.save();
		return newDeposit;

	} catch (ex) {
		return ex;
	}

}
