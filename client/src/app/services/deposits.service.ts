import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// Interfaces:
import { IDeposit } from 'net-worth-shared';
// Models:
import { Deposit } from '../models/Deposit';
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

	constructor(
		private http: HttpClient
	) { }

	getDepositsByOwner(
		email: string
	): Observable<IDeposit[]> {
		log('deposits.service.ts', this.getDepositsByOwner.name, 'this.SEARCH_URL:', this.SEARCH_URL);

		const request = this.http
			.post<IDeposit[]>(
				this.SEARCH_URL,
				new SearchOption({ owner: email })
			)
			.pipe(tap(() => { }));

		return request;
	}

	postDeposit(
		deposit: Partial<Deposit>
	) {
		log('deposits.service.ts', this.postDeposit.name, 'this.BASE_URL:', this.BASE_URL);
		log('deposits.service.ts', this.postDeposit.name, 'deposit:', deposit);

		const request = this.http
			.post<IDeposit>(
				this.BASE_URL,
				deposit
			)
			.pipe(tap(() => { }));

		return request;
	}

	getTotalAmount(deposits: IDeposit[]): number {
		let total = 0;
		deposits.forEach((deposit: IDeposit) => { total += deposit.amount });
		return total;
	}

}
