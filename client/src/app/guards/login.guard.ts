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
export class loginGuard {

	constructor(
		private authService: AuthService,
		private router: Router
	) { }

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
		// do not allow "/login" if user is authenticated
		return true;
	}
}
*/

// /*
// prettier-ignore
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';

export const loginGuard: CanActivateFn = (
	_route: ActivatedRouteSnapshot,
	_state: RouterStateSnapshot
) => {
	// do not allow "/login" if user is authenticated
	return true;
};
// */
