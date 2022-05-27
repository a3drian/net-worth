import { Injectable } from '@angular/core';
// rxjs:
import { BehaviorSubject, tap } from 'rxjs';
// Interfaces:
import { IUser } from '../models/User';
// Services:
import { AuthService } from './auth.service';

@Injectable({
	providedIn: 'root'
})
export class InformationService {

	public totalAmount = new BehaviorSubject<number>(0);
	public owner = new BehaviorSubject<string>('');
	public user = new BehaviorSubject<IUser | null>(null);

	constructor(private authService: AuthService) {
		const userAuthenticated = this.authService.isAuthenticated();
		if (userAuthenticated) {
			this.authService.autoLogin();
			const user = this.authService.user.value;
			const email = user ? user.email : '';
			this.owner.next(email);
			if (user) { this.user.next(user); }
		}
	}
}
