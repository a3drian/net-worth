import { Injectable } from '@angular/core';
// rxjs:
import { BehaviorSubject } from 'rxjs';
// Shared:
import { Constants } from '../shared/Constants';

@Injectable({
	providedIn: 'root'
})
export class InformationService {

	public totalAmount = new BehaviorSubject<number>(0);
	public owner = new BehaviorSubject<string>(Constants.defaultOwner);

	constructor() { }
}
