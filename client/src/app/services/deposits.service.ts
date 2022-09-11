import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// Interfaces:
import { IDeposit } from 'net-worth-shared';
// Models:
import { SearchOption } from '../models/SearchOption';
// rxjs:
import { Observable, tap } from 'rxjs';
// Shared:
import { Constants } from '../shared/Constants';
import { CURRENCY } from '../shared/constants/Currencies';
import { log } from '../shared/Logger';

@Injectable({
	providedIn: 'root'
})
export class DepositsService {

	private readonly BASE_URL: string = Constants.apiEndpoints.SPEND_BASE_URL;
	private readonly SEARCH_URL: string = this.BASE_URL + Constants.apiEndpoints.SEARCH_URL;

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
		log(this.CLASS_NAME, this.getDepositsByOwner.name, 'email:', email);

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

	getTotalAmount(deposits: IDeposit[], currency: CURRENCY = CURRENCY.LEI): number {
		let total = 0;
		const result = this.getDepositsByCurrency(deposits, currency);
		result.forEach((deposit: IDeposit) => { total += deposit.amount; });
		return total;
	}

	private getDepositsByCurrency(deposits: IDeposit[], currency: CURRENCY = CURRENCY.LEI): IDeposit[] {
		const result = deposits.filter(d => d.currency === currency);
		return result;
	}

}
