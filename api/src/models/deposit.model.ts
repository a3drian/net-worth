import { IDeposit } from '../interfaces/IDeposit';

export class Deposit implements IDeposit {
	amount!: number;
	currency!: string;
	createdAt!: Date;
	exchangeRate!: number;

	public constructor(partial?: Partial<IDeposit>) {
		Object.assign(this, partial);
	}
}
