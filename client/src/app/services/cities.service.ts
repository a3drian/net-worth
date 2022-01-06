import { Injectable } from '@angular/core';
// Shared:
import { CITIES } from '../shared/constants/Cities';

@Injectable({
	providedIn: 'root'
})
export class CitiesService {

	cities: CITIES[] = Object.values(CITIES);

	constructor() { }

	getCities(): CITIES[] {
		return this.cities;
	}
}
