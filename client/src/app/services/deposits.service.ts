import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// Interfaces:
import { IDeposit } from 'net-worth-shared';
// Models:
import { IDepositKVPair, IDepositKVPairDiff } from '../models/Deposit';
import { SearchOption } from '../models/SearchOption';
// rxjs:
import { Observable, tap } from 'rxjs';
// Shared:
import { Constants } from '../shared/Constants';
import { log } from '../shared/Logger';

@Injectable({
	providedIn: 'root'
})
export class DepositsService {

	private readonly BASE_URL: string = Constants.apiEndpoints.SPEND_BASE_URL;
	private readonly SEARCH_URL: string = this.BASE_URL + Constants.apiEndpoints.SPEND_SEARCH_URL;

	private readonly CLASS_NAME = 'deposits.service.ts';

	constructor(
		private http: HttpClient
	) { }

	validId(id: string): boolean {
		log(this.CLASS_NAME, this.validId.name, 'id:', id);
		return true;
	}

	getDepositsById(id: string): Observable<IDeposit> {
		const url = `${this.BASE_URL}/${id}`;

		log(this.CLASS_NAME, this.getDepositsById.name, 'url:', url);

		const request = this.http
			.get<IDeposit>(url)
			.pipe(tap(() => { }));

		return request;
	}

	getDepositsByOwner(
		email: string
	): Observable<IDeposit[]> {
		log(this.CLASS_NAME, this.getDepositsByOwner.name, 'owner:', email);

		const request = this.http
			.post<IDeposit[]>(
				this.SEARCH_URL,
				new SearchOption({ owner: email })
			)
			.pipe(tap(() => { }));

		return request;
	}

	postDeposit(
		deposit: Partial<IDeposit>
	) {
		log(this.CLASS_NAME, this.postDeposit.name, 'deposit:', deposit);

		const request = this.http
			.post<IDeposit>(
				this.BASE_URL,
				deposit
			)
			.pipe(tap(() => { }));

		return request;
	}

	putDeposit(
		id: string,
		deposit: Partial<IDeposit>
	) {
		const url = `${this.BASE_URL}/${id}`;

		log(this.CLASS_NAME, this.putDeposit.name, 'url:', url);

		const request = this.http
			.put<IDeposit>(
				url,
				deposit
			)
			.pipe(tap(() => { }));

		return request;
	}

	deleteDeposit(id: string) {
		const url = `${this.BASE_URL}/${id}`;

		log(this.CLASS_NAME, this.deleteDeposit.name, 'url:', url);

		const request = this.http
			.delete<IDeposit>(url)
			.pipe(tap(() => { }));

		return request;
	}

	getTotalAmount(deposits: IDeposit[]): number {
		let total = 0;
		deposits.forEach((deposit: IDeposit) => { total += deposit.amount });
		return total;
	}

	getDepositKVPair(deposit: IDeposit): IDepositKVPair[] {
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

	getDepositKVPairDifferences(d1: IDepositKVPair[], d2: IDepositKVPair[]): IDepositKVPairDiff[] {
		// TODO: check if there is any way "d1.length" might end up being different than "d2.length"
		if (d1.length !== d2.length) {
			if (d1.length > d2.length) { }
			if (d2.length > d1.length) { }
			return [];
		}
		let diff: IDepositKVPairDiff[] = [];
		for (let i = 0; i < d1.length; i++) {
			const k = d1[i].key;
			const v1 = d1[i].value;
			const v2 = d2[i].value;
			if (v1 !== v2) {
				log('Deposit.ts', this.getDepositKVPairDifferences.name, `'${k}' changed, ${v1} => ${v2}`);
				diff.push({ key: k, oldValue: v1, newValue: v2 });
			}
		}
		return diff;
	}

}
