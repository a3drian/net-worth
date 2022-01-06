import { Injectable } from '@angular/core';
// Shared:
import { LOCATIONS } from '../shared/constants/Locations';

@Injectable({
	providedIn: 'root'
})
export class LocationsService {

	locations: LOCATIONS[] = Object.values(LOCATIONS);

	constructor() { }

	getLocations(): LOCATIONS[] {
		return this.locations;
	}
}
