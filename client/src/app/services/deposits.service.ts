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
			.pipe(
				tap(
					() => { }
				)
			);

		return request;
	}

}
