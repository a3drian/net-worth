import { Injectable } from '@angular/core';
// Shared:
import { CITIES } from '../shared/constants/Cities';

@Injectable({
	providedIn: 'root'
})
export class CitiesService {

	cities = [
		CITIES.BRASOV,
		CITIES.BUCURESTI,
		CITIES.CLUJ,
		CITIES.TIMISOARA
	];

	constructor() { }

	getCities(): CITIES[] {
		return this.cities;
	}
}
