import { IDeposit } from 'net-worth-shared';

export class Deposit implements IDeposit {
	_id!: string;
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
