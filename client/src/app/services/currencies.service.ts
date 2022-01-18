import { Injectable } from '@angular/core';
// Models:
import { Currency } from 'net-worth-shared';
// Shared:
import { CURRENCY } from 'net-worth-shared';

@Injectable({
	providedIn: 'root'
})
export class CurrenciesService {

	currencies: Currency[] = Object.values(CURRENCY);

	constructor() { }

	getCurrencies(): Currency[] {
		return this.currencies;
	}
}
