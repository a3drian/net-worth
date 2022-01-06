import { IDeposit } from 'net-worth-shared';

export class Deposit implements IDeposit {
	_id!: string;
	owner!: string;
	amount!: number;
	details!: string;
	currency!: string;
	createdAt!: Date;
	modifiedAt?: Date | undefined;
	exchangeRate!: number;

	recurrent?: boolean;
	category?: string;
	location?: string;
	city?: string;

	public constructor(partial?: Partial<Deposit>) {
		Object.assign(this, partial);
	}
}
