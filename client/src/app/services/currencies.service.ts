import { Injectable } from '@angular/core';
// Shared:
import { CURRENCY } from '../shared/constants/Currencies';

@Injectable({
	providedIn: 'root'
})
export class CurrenciesService {

	currencies: CURRENCY[] = Object.values(CURRENCY);

	constructor() { }

	getCurrencies(): CURRENCY[] { return this.currencies; }
}
