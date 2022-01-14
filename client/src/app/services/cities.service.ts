import { Injectable } from '@angular/core';
// Shared:
import { CITY } from '../shared/constants/Cities';

@Injectable({
	providedIn: 'root'
})
export class CitiesService {

	cities: CITY[] = Object.values(CITY);

	constructor() { }

	getCities(): CITY[] {
		return this.cities;
	}
}
