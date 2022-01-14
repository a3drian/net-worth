import { Injectable } from '@angular/core';
// Shared:
import { FREQUENCY } from '../shared/constants/Frequencies';

@Injectable({
	providedIn: 'root'
})
export class FrequenciesService {

	frequencies: FREQUENCY[] = Object.values(FREQUENCY);

	constructor() { }

	getFrequencies(): FREQUENCY[] {
		return this.frequencies;
	}
}
