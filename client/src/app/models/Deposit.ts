import { Currency, IDeposit } from 'net-worth-shared';

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

export type DepositValues =
	boolean | Date | number | string | Currency;

export type DepositDifferences = {
	key: DepositProperties;
	oldValue: DepositValues;
	newValue: DepositValues;
};

export class DepositDTO {
	id?: string;
	owner?: string;

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

	public constructor(partial?: Partial<DepositDTO>) {
		Object.assign(this, partial);
	}
}
