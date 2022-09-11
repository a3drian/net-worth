// Models:
import { DepositProperties, DepositValues } from '../models/Deposit';

export interface IControl {
	key: DepositProperties;
	value: DepositValues;
	dirty: boolean;
	touched: boolean;
	valid: boolean;
}
