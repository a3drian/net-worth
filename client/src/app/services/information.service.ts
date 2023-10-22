import { Injectable } from '@angular/core';
// Models:
import { Currency } from '../models/Currency';
// rxjs:
import { BehaviorSubject } from 'rxjs';
// Interfaces:
import { IUser } from '../interfaces/IUser';
// Services:
import { AuthService } from './auth.service';

@Injectable({
	providedIn: 'root'
})
export class InformationService {

	public totalAmount$ = new BehaviorSubject<Currency>({ LEI: 0, EUR: 0, GBP: 0, USD: 0 });
	public owner$ = new BehaviorSubject<string>('');
	public user$ = new BehaviorSubject<IUser | null>(null);

	constructor(private authService: AuthService) {
		const userAuthenticated = this.authService.isAuthenticated();
		if (userAuthenticated) {
			this.authService.autoLogin();
			const user = this.authService.user$.value;
			const email = user ? user.email : '';
			this.owner$.next(email);
			if (user) { this.user$.next(user); }
		}
	}
}
