import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// Services:
import { AuthService } from 'src/app/services/auth.service';
// Components:
import { Constants } from 'src/app/shared/Constants';
import { log } from 'src/app/shared/Logger';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

	isInDebugMode: boolean = Constants.IN_DEBUG_MODE;

	isLoading = true;

	constructor(
		private authService: AuthService,
		private router: Router
	) { }

	ngOnInit(): void {
		const userAuthenticated = this.authService.isAuthenticated();
		if (userAuthenticated) {
			this.isLoading = false;
			this.router
				.navigate([Constants.appEndpoints.DASHBOARD_URL])
				.catch(
					(error) => {
						log('login.ts', this.ngOnInit.name, `Could not navigate to: ${Constants.appEndpoints.DASHBOARD_URL}`, error);
					}
				);
		}
	}

	login(): void {
		this.isLoading = true;
		setTimeout(
			() => {
				this.router.navigate([Constants.appEndpoints.DASHBOARD_URL]);
				this.isLoading = false;
			}, 500);
	}

	loginWithGoogle() {
		this.authService
			.loginWithGoogle()
			.then(() => {
				this.isLoading = true;
				setTimeout(
					() => {
						this.router.navigate([Constants.appEndpoints.DASHBOARD_URL]);
						this.isLoading = false;
					}, Constants.updateTimeout);
			});
	}

	logout() {
		this.isLoading = true;
		this.authService
			.logout()
			.then(() => setTimeout(
				() => {
					this.isLoading = false;
					this.router.navigate([Constants.appEndpoints.LOGIN_URL]);
				}, Constants.updateTimeout)
			);
	}
}
