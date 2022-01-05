import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// Components:
import { Constants } from 'src/app/shared/Constants';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

	isInDebugMode: boolean = Constants.IN_DEBUG_MODE;
	isLoading = false;

	constructor(private router: Router) { }

	ngOnInit(): void { }

	login(): void {
		this.isLoading = true;
		setTimeout(
			() => {
				this.router.navigate([Constants.appEndpoints.DASHBOARD_URL]);
				this.isLoading = false;
			}, 500);
	}

}
