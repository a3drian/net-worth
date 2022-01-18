export interface IDeposit {
	_id: string;
	owner: string;
	amount: number;
	details: string;
	createdAt: Date;

	category?: string;
	location?: string;
	city?: string;

	recurrent?: boolean;
	frequency?: string;

	currency?: string;
	exchangeRate?: number;
}
