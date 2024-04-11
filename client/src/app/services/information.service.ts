import { Injectable, signal } from '@angular/core';
// Models:
import { Currency } from '../models/Currency';
// Interfaces:
import { IUser } from '../interfaces/IUser';
// Services:
import { AuthService } from './auth.service';

@Injectable({
	providedIn: 'root'
})
export class InformationService {

	public totalAmount = signal<Currency>({ LEI: 0, EUR: 0, GBP: 0, USD: 0 });
	public owner = signal('');
	public user = signal<IUser | null>(null);

	constructor(private authService: AuthService) {
		const userAuthenticated = this.authService.isAuthenticated();
		if (userAuthenticated) {
			this.authService.autoLogin();
			const user = this.authService.user();
			const email = user ? user.email : '';
			this.owner.set(email);
			if (user) { this.user.set(user); }
		}
	}
}
