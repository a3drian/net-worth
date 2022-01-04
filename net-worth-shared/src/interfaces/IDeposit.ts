export interface IDeposit {
	_id: string;
	owner: string;
	amount: number;
	currency: string;
	createdAt: Date;
	modifiedAt?: Date;
	exchangeRate: number;
}
