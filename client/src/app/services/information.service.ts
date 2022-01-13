import { Injectable } from '@angular/core';
// rxjs:
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class InformationService {

	public totalAmount = new BehaviorSubject<number>(0);

	constructor() { }
}
