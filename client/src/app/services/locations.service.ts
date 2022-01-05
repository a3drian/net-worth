import { Injectable } from '@angular/core';
// Shared:
import { LOCATIONS } from '../shared/constants/Locations';

@Injectable({
	providedIn: 'root'
})
export class LocationsService {

	locations = [
		LOCATIONS.CARREFOUR,
		LOCATIONS.LIDL,
		LOCATIONS.PROFI,
		LOCATIONS.SELGROS
	];

	constructor() { }

	getLocations(): LOCATIONS[] {
		return this.locations;
	}
}
