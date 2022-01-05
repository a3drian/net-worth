// Models:
import { Currency } from '../../models/Currency';

export class CURRENCIES {
	static readonly LEI = new Currency({ name: 'Lei', symbol: 'L', code: 'RON' });
	static readonly EUR = new Currency({ name: 'Euro', symbol: '€', code: 'EUR' });
	static readonly GBP = new Currency({ name: 'Lire sterline', symbol: '£', code: 'GBP' });

	private constructor(private readonly key: string, public readonly value: any) { }

	toString() {
		return this.key;
	}
}
