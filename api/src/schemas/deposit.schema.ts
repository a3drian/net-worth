import mongoose from 'mongoose';
const { model, Schema } = mongoose;
// Interfaces:
import { IDeposit } from '../interfaces/IDeposit';

const depositSchema = new Schema<IDeposit>(
	{
		owner: { type: String, required: true },
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

export { DepositModel };
