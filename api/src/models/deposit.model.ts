import mongoose from 'mongoose';
const { model, Schema } = mongoose;
import { IDeposit } from '../interfaces/IDeposit';

const depositSchema = new Schema<IDeposit>(
	{
		amount: { type: Number, required: true },
		currency: { type: String, required: true },
		createdAt: { type: Date, required: true },
		exchangeRate: { type: Number, required: true },
	},
	{
		collection: 'Deposits',
		versionKey: '_ver'
	}
);

const DepositModel = model<IDeposit>('Deposit', depositSchema);

class Deposit implements IDeposit {
	amount!: number;
	currency!: string;
	createdAt!: Date;
	exchangeRate!: number;

	public constructor(partial?: Partial<IDeposit>) {
		Object.assign(this, partial);
	}
}

export { DepositModel, Deposit };
