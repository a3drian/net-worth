import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// Interfaces:
import { IDeposit } from 'net-worth-shared';
// Services:
import { DepositsService } from 'src/app/services/deposits.service';
import { InformationService } from 'src/app/services/information.service';
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

	errorResponse: HttpErrorResponse | null = null;
	today: Date = new Date();

	deposits: IDeposit[] = [];
	totalAmount: number = 0;

	constructor(
		private router: Router,
		private depositsService: DepositsService,
		private informationService: InformationService
	) { }

	ngOnInit(): void {
		this.depositsService
			.getDepositsByOwner(Constants.defaultOwner)
			.subscribe(
				(deposits: IDeposit[]) => {
					this.deposits = deposits;
					this.totalAmount = this.depositsService.getTotalAmount(this.deposits);
					this.informationService.totalAmount.next(this.totalAmount);
					this.informationService.totalAmount.subscribe((totalAmount: number) => this.totalAmount = totalAmount);
					this.isLoading = false;
				}
			);
	}

	navigateToSpendPage(): void {
		const spendUrl = Constants.appEndpoints.SPEND_URL;
		this.router
			.navigateByUrl(spendUrl)
			.catch((error) => { log('dashboard.ts', this.navigateToSpendPage.name, `Could not navigate to: ${spendUrl}`, error); });
	}

	updateDeposit(event: any): void {
		log('dashboard.ts', this.updateDeposit.name, 'typeof(event):', typeof (event));
		log('dashboard.ts', this.updateDeposit.name, 'event:', event);
	}
}
