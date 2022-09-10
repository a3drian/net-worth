import { Pipe, PipeTransform } from '@angular/core';
// Shared:
import { CURRENCY } from '../constants/Currencies';

@Pipe({ name: 'currency' })
export class CurrencyPipe implements PipeTransform {

	transform(currency: string): string {
		switch (currency) {
			case CURRENCY.EUR: {
				return 'euro';
			}
			case CURRENCY.GBP: {
				return 'lire';
			}
			default: {
				return 'lei';
			}
		}
	}
}
