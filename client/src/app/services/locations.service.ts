import { Injectable } from '@angular/core';
// Shared:
import { LOCATION } from '../shared/constants/Locations';

@Injectable({
	providedIn: 'root'
})
export class LocationsService {

	locations: LOCATION[] = Object.values(LOCATION);

	constructor() { }

	getLocations(): LOCATION[] {
		return this.locations;
	}
}
