import { IDeposit } from '../interfaces/IDeposit';

export class Deposit implements IDeposit {
	id!: string;
	owner!: string;
	amount!: number;
	currency!: string;
	createdAt!: Date;
	exchangeRate!: number;
	modifiedAt?: Date | undefined;

	public constructor(partial?: Partial<IDeposit>) {
		Object.assign(this, partial);
	}
}
