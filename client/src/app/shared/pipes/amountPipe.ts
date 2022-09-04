import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'amount' })
export class AmountPipe implements PipeTransform {

	transform(amount: number, precision: number = 2): number {
		return Number(amount.toFixed(precision));
	}
}
