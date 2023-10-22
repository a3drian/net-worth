import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// Shared:
import { Constants } from 'src/app/shared/Constants';

@Component({
	selector: 'app-policy',
	templateUrl: './policy.component.html',
	styleUrls: ['./policy.component.scss']
})
export class PolicyComponent implements OnInit {

	isInDebugMode: boolean = Constants.IN_DEBUG_MODE;

	DASHBOARD_URL = '/' + Constants.appEndpoints.DASHBOARD_URL;

	constructor(private router: Router) { }

	ngOnInit(): void { }

	redirect(): void {
		this.router.navigate([this.DASHBOARD_URL]);
	}

}
