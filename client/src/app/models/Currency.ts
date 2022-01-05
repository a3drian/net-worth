export class Currency {
	name!: string;
	symbol!: string;
	code!: string;	// useful for retrieving live exchange rate

	public constructor(partial?: Partial<Currency>) {
		Object.assign(this, partial);
	}
}
