import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
// Services:
import { DepositsService } from 'src/app/services/deposits.service';
// Shared:
import { Constants } from 'src/app/shared/Constants';
import { log } from 'src/app/shared/Logger';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

	isInDebugMode: boolean = Constants.IN_DEBUG_MODE;
	isLoading: boolean = true;
	depositsLoaded: boolean = false;

	errorResponse: HttpErrorResponse | null = null;

	deposits: any;

	constructor(
		private depositsService: DepositsService
	) { }

	ngOnInit(): void {
		this.depositsService
			.getDepositsByOwner('adi@foodspy.com')
			.subscribe(
				(deposits) => {
					this.deposits = deposits;
					this.depositsLoaded = true;
					this.isLoading = false;
				}
			);
	}

}
