export interface IDeposit {
	amount: number;
	currency: string;
	createdAt: Date;
	modifiedAt?: Date;
	exchangeRate: number;
}
