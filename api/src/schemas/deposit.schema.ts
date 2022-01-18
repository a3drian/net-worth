import mongoose from 'mongoose';
const { model, Schema } = mongoose;
// Interfaces:
import { IDeposit } from 'net-worth-shared';

const depositSchema = new Schema<IDeposit>(
	{
		owner: { type: String, required: true },
		amount: { type: Number, required: true },
		details: { type: String, required: true },
		createdAt: { type: Date, required: true },

		category: { type: String, required: true },
		location: { type: String, required: true },
		city: { type: String, required: true },

		recurrent: { type: Boolean, required: false },
		frequency: { type: String, required: false },

		currency: { type: String, required: false },
		exchangeRate: { type: Number, required: false },
	},
	{
		collection: 'Deposits',
		versionKey: '_ver'
	}
);

const DepositModel = model<IDeposit>('Deposit', depositSchema);

export { DepositModel };
