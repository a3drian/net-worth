import { Injectable, signal } from '@angular/core';
import {
	Auth,
	GoogleAuthProvider,
	signInWithPopup,
	signOut,
	UserCredential
} from '@angular/fire/auth';
// Interfaces:
import { IUser } from '../interfaces/IUser';
// Models:
import { GoogleUser } from 'src/app/models/User';
// rxjs:
import { map, Observable, of } from 'rxjs';
// Shared:
import { Constants } from '../shared/Constants';
import { log } from '../shared/Logger';

@Injectable({
	providedIn: 'root',
})
export class AuthService {

	isInDebugMode: boolean = Constants.IN_DEBUG_MODE;

	user$ = signal<IUser | null>(null);

	private USER_KEY = 'SPENDIT_USER';
	private TOKEN_KEY = 'SPENDIT_TOKEN';

	constructor(private auth: Auth) { }

	async loginWithGoogle() {

		let user: GoogleUser;
		const provider = new GoogleAuthProvider();

		await signInWithPopup(this.auth, provider)
			.then(
				(uc: UserCredential) => {
					user = { ...uc.user } as IUser;
					log('auth.service', this.loginWithGoogle.name, 'user:', user.displayName);

					if (!user.accessToken) { return of(null); }

					this.user$.set(user);
					const token = user.accessToken;
					this.setSessionInfo(user, token);
					return of(token);
				}
			)
			.catch(e => {
				log('auth.service', this.loginWithGoogle.name, 'Exception while signing in with Google:', e);
				this.removeUserData();
			});
	}

	acquireToken(): Observable<string | null> {
		const token = sessionStorage.getItem(this.TOKEN_KEY);
		return of(token);
	}

	async logout(): Promise<void> {
		await signOut(this.auth)
			.catch(e => log('auth.service', this.logout.name, 'Exception while signing out:', e))
			.finally(() => this.removeUserData());
	}

	// Helper methods:
	autoLogin(): void {
		log('auth.service', this.autoLogin.name, '');

		const session = this.getSessionInfo();
		if (!session) { return; }

		session.subscribe((user: IUser | null) => this.user$.set(user));
	}

	// autoLogout(): void {}

	isAuthenticated(): Observable<boolean> {
		return this.getSessionInfo().pipe(map(u => u !== null));
	}

	private removeUserData() {
		this.user$.set(null);
		sessionStorage.removeItem(this.USER_KEY);
		sessionStorage.removeItem(this.TOKEN_KEY);
	}

	private setSessionInfo(user: IUser, token: string): void {
		sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
		sessionStorage.setItem(this.TOKEN_KEY, token);
	}

	private getSessionInfo(): Observable<IUser | null> {
		const userSessionInfo = sessionStorage.getItem(this.USER_KEY);

		if (!userSessionInfo) { return of(null); }

		const sessionInfo = JSON.parse(userSessionInfo);
		log('auth.service', this.getSessionInfo.name, 'Session info:', sessionInfo.email);
		return of(sessionInfo);
	}
}
