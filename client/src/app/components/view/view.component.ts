import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
// Interfaces
import { IDeposit } from 'net-worth-shared';
import { lastValueFrom } from 'rxjs';
// Services:
import { DepositsService } from 'src/app/services/deposits.service';
// Shared:
import { Constants } from 'src/app/shared/Constants';
import { log } from 'src/app/shared/Logger';

@Component({
	selector: 'app-view',
	templateUrl: './view.component.html',
	styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

	isInDebugMode: boolean = Constants.IN_DEBUG_MODE;

	DASHBOARD_URL = '/' + Constants.appEndpoints.DASHBOARD_URL;

	depositId: string = '';
	deposit: IDeposit = <IDeposit>{};

	isLoading: boolean = true;
	ready: boolean = false;

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private depositsService: DepositsService
	) {
		this.activatedRoute.params.subscribe(
			(params: Params) => {
				this.depositId = params['id'] ? params['id'] : '0';
				log('view.ts', 'constructor()', 'this.depositId:', this.depositId);
			}
		);

		if (this.depositId === '0') { log('view.ts', 'constructor()', 'this.depositId === 0'); }
		if (!this.depositsService.validId(this.depositId)) { /* throw error */ }

		this.depositsService
			.getDepositsById(this.depositId)
			.subscribe(
				(deposit: IDeposit) => {
					this.deposit = deposit;
					this.isLoading = false;
					this.ready = true;
				}
			);
	}

	private async initializeDeposit(): Promise<IDeposit> {
		return await lastValueFrom(this.depositsService.getDepositsById(this.depositId));
	}

	ngOnInit(): void { }

	redirect(): void {
		this.router.navigate([this.DASHBOARD_URL]);
	}

}
