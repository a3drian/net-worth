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

// TODO: can you extract these automtically?
export type DepositProperties =
	'amount' | 'details' | 'createdAt' |
	'category' | 'location' | 'city' |
	'recurrent' | 'frequency' | 'currency' | 'exchangeRate';

export type DepositDifferences = {
	key: DepositProperties;
	oldValue: string;
	newValue: string;
};

export class DepositFromForm {
	amount?: number;
	details?: string;
	createdAt?: Date;

	category?: string;
	location?: string;
	city?: string;

	recurrent?: boolean;
	frequency?: string;
	currency?: string;
	exchangeRate?: number;

	public constructor(partial?: Partial<DepositFromForm>) {
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
