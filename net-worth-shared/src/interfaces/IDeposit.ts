export interface IDeposit {
	_id: string;
	owner: string;
	amount: number;
	details: string;
	createdAt: Date;

	currency?: string;
	modifiedAt?: Date;
	exchangeRate?: number;
	frequency?: string;

	recurrent?: boolean;
	category?: string;
	location?: string;
	city?: string;
}
