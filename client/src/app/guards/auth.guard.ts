/*
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
// rxjs:
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
// Services:
import { AuthService } from '../services/auth.service';
// Shared:
import { Constants } from '../shared/Constants';
import { log } from '../shared/Logger';

@Injectable({
	'providedIn': 'root'
})
export class authGuard {

	constructor(
		private authService: AuthService,
		private router: Router
	) { }

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
		const r = route.url[0].path;
		log('auth.guard', this.canActivate.name, 'route:', r);

		// return true;
		return this.authService
			.isAuthenticated()
			.pipe(
				tap(
					(userAuthenticated: boolean) => {
						log('auth.guard', this.canActivate.name, 'userAuthenticated:', userAuthenticated);

						if (!userAuthenticated) {
							this.router.navigate([Constants.appEndpoints.LOGIN_URL], { replaceUrl: true });
						}

						return userAuthenticated;
					}
				)
			);
	}
}
*/

// /*
// prettier-ignore
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
// rxjs:
import { catchError, of, tap } from 'rxjs';
// Services:
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
// Shared:
import { Constants } from '../shared/Constants';
import { log } from '../shared/Logger';

export const authGuard: CanActivateFn = (
	route: ActivatedRouteSnapshot,
	_state: RouterStateSnapshot
) => {
	const r = route.url[0].path;
	log('auth.guard', authGuard.name, 'route:', r);

	const authService = inject(AuthService);
	const router = inject(Router);

	// prettier-ignore
	return authService
		.isAuthenticated()
		.pipe(
			tap((userAuthenticated: boolean) => {
				log('auth.guard', authGuard.name, 'userAuthenticated:', userAuthenticated);

				if (!userAuthenticated) {
					router.navigate([Constants.appEndpoints.LOGIN_URL], { replaceUrl: true });
				}

				return userAuthenticated;
			}),
			catchError(() => {
				router.navigate([Constants.appEndpoints.LOGIN_URL], { replaceUrl: true });
				return of(false);
			})
	);
};
// */
