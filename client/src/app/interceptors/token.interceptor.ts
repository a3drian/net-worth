import {
	HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

	constructor(private authService: AuthService) { }

	intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

			let headers = request.headers || new HttpHeaders();

			return this.authService.acquireToken()
					.pipe(tap(token => token), switchMap((token) => {
							if (token !== null) {
									headers = headers.append('Authorization', `Bearer ${token}`);
									return next.handle(request.clone({ headers: headers }));
							}

							return next.handle(request);
					}));
	}
}
