import { Injectable } from '@angular/core';
// Models:
import { Currency } from '../models/Currency';
// Shared:
import { CURRENCIES } from '../shared/constants/Currencies';

@Injectable({
	providedIn: 'root'
})
export class CurrenciesService {

	currencies = [
		CURRENCIES.LEI,
		CURRENCIES.EUR,
		CURRENCIES.GBP
	];

	constructor() { }

	getCurrencies(): Currency[] {
		return this.currencies;
	}
}
