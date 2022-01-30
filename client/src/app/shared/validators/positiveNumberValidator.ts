import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
// Shared:
import { log } from '../Logger';

export function positiveNumberValidator(): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {

		// log('positiveValidator.ts', positiveValidator.name, 'control:', control);
		// log('positiveValidator.ts', positiveValidator.name, 'control.errors:', control.errors);
		// log('positiveValidator.ts', positiveValidator.name, 'control.value:', control.value);

		const value = control.value;

		if (!value) { return null; }

		let validType: boolean = false;
		let validValue: boolean = false;
		if (typeof value === 'number') {
			validType = true;
			if (value > 0) {
				validValue = true;
			}
		}

		const negative = validType && validValue;

		return !negative ? { 'negative': true } : null;
	}
}
