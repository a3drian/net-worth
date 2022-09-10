export interface IDeposit {
	_id: string;

	owner: string;

	amount: number;
	currency: string;

	details: string;
	createdAt: Date;

	category: string;
	refundable?: boolean;
}
