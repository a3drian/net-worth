import { IDeposit } from 'net-worth-shared';
// Shared:
import { log } from '../shared/Logger';

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

interface IDepositKVPair {
	key: string,
	value: string
}

export interface IDepositKVPairDiff {
	key: string;
	oldValue: string;
	newValue: string;
}

export function getDepositKVPair(deposit: IDeposit): IDepositKVPair[] {
	// TODO: compara sa fie aceleasi proprietati ca intr-un IDeposit
	const d: IDepositKVPair[] = Object.entries(deposit)
		.map(e => { return { key: e[0], value: e[1] } })
		.filter(e => e.key !== '_id')
		.filter(e => e.key !== '_ver')
		.sort((a, b) => { return a.key.localeCompare(b.key) })
		.map(e => e.key === 'createdAt' ?
			{ key: 'createdAt', value: new Date(e.value).toISOString() } : { key: e.key.toString(), value: e.value.toString() });
	return d;
}

export function getDepositKVPairDifferences(d1: IDepositKVPair[], d2: IDepositKVPair[]): IDepositKVPairDiff[] {
	let diff: IDepositKVPairDiff[] = [];
	// TODO: check if there is any way "d1.length" might end up being different than "d2.length"
	if (d1.length !== d2.length) {
		if (d1.length > d2.length) { }
		if (d2.length > d1.length) { }
		return [];
	}
	for (let i = 0; i < d1.length; i++) {
		const k = d1[i].key;
		const v1 = d1[i].value;
		const v2 = d2[i].value;
		if (v1 !== v2) {
			log('Deposit.ts', getDepositKVPairDifferences.name, `'${k}' changed, ${v1} => ${v2}`);
			diff.push({ key: k, oldValue: v1, newValue: v2 });
		}
	}
	return diff;
}
