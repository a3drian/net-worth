import { Injectable } from '@angular/core';
// Shared:
import { CURRENCY } from 'net-worth-shared';

@Injectable({
	providedIn: 'root'
})
export class ExchangeRatesService {

	constructor() { }

	getExchangeRate(currency: string): number {
		switch (currency) {
			case (CURRENCY.EUR.name): { return 4.9; }
			case (CURRENCY.GBP.name): { return 5.8; }
			default: { return 1; }
		}
	}
}
