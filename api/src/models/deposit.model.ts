import { IDeposit } from 'net-worth-shared';

export class Deposit implements IDeposit {
	_id!: string;

	owner!: string;

	amount!: number;
	currency!: string;

	details!: string;
	createdAt!: Date;

	category!: string;

	refundable?: boolean;
	refunded?: boolean;

	public constructor(partial?: Partial<Deposit>) {
		Object.assign(this, partial);
	}
}
