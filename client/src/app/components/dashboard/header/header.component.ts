import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// Interfaces:
import { IUser } from 'src/app/interfaces/IUser';
// Services:
import { AuthService } from 'src/app/services/auth.service';
// Shared:
import { Constants } from '../../../shared/Constants';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

	isInDebugMode: boolean = Constants.IN_DEBUG_MODE;
	isLoading: boolean = true;

	user: IUser | null = null;

	constructor(
		private authService: AuthService,
		private router: Router
	) {
		this.user = this.authService.user$.value;
	}

	ngOnInit(): void { }

	logout(): void {
		this.isLoading = true;
		this.authService
			.logout()
			.then(() => setTimeout(
				() => {
					this.isLoading = false;
					this.router.navigate([Constants.appEndpoints.LOGIN_URL]);
				},
				Constants.updateTimeout)
			);
	}
}
