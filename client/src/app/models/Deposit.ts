import { IDeposit } from 'net-worth-shared';

export class Deposit implements IDeposit {
	_id!: string;
	owner!: string;
	amount!: number;
	details!: string;
	createdAt!: Date;

	category?: string;
	location?: string;
	city?: string;

	recurrent?: boolean;
	frequency?: string;
	currency?: string;
	exchangeRate?: number;

	public constructor(partial?: Partial<Deposit>) {
		Object.assign(this, partial);
	}
}

export interface IDepositKVPair {
	key: string,
	value: string
}

export interface IDepositKVPairDiff {
	key: string;
	oldValue: string;
	newValue: string;
}
