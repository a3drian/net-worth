import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
// Components:
import { ShowDepositDialogComponent } from '../dialogs/show-deposit-dialog/show-deposit-dialog.component';
// Interfaces:
import { IDeposit } from 'net-worth-shared';
import { IUser } from 'src/app/interfaces/IUser';
// Models:
import { Currency } from 'src/app/models/Currency';
// rxjs:
import { Subscription } from 'rxjs';
// Services:
import { AuthService } from 'src/app/services/auth.service';
import { DepositsService } from 'src/app/services/deposits.service';
import { InformationService } from 'src/app/services/information.service';
// Shared:
import { Constants } from 'src/app/shared/Constants';
import { CURRENCY } from 'src/app/shared/constants/Currencies';
import { log } from 'src/app/shared/Logger';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

	isInDebugMode: boolean = Constants.IN_DEBUG_MODE;
	isLoading: boolean = false;
	isDepositsLoading: boolean = false;

	errorResponse: HttpErrorResponse | null = null;
	today: Date = new Date();

	deposits: IDeposit[] = [];
	totalAmount: Currency = { LEI: 0, EUR: 0, GBP: 0, USD: 0 };
	anyMoneySpent: boolean = false;

	owner: string = '';
	user: IUser | null = null;
	showDepositDialogSub: Subscription = new Subscription();

	constructor(
		private depositsService: DepositsService,
		private informationService: InformationService,
		public showDepositDialog: MatDialog,
		private authService: AuthService
	) {
		this.owner = this.informationService.owner.value;
		this.user = this.authService.user.value;
	}

	ngOnInit(): void {
		this.depositsService
			.getDepositsByOwner(this.owner)
			.subscribe(
				(deposits: IDeposit[]) => {
					this.deposits = deposits;
					this.totalAmount.LEI = this.depositsService.getTotalAmount(this.deposits);
					this.totalAmount.EUR = this.depositsService.getTotalAmount(this.deposits, CURRENCY.EUR);
					this.totalAmount.GBP = this.depositsService.getTotalAmount(this.deposits, CURRENCY.GBP);
					this.totalAmount.USD = this.depositsService.getTotalAmount(this.deposits, CURRENCY.USD);
					this.anyMoneySpent =
						this.totalAmount.LEI !== 0 ||
						this.totalAmount.EUR !== 0 ||
						this.totalAmount.GBP !== 0 ||
						this.totalAmount.USD !== 0;
					this.informationService.totalAmount.next(this.totalAmount);
					this.informationService.totalAmount.subscribe(totalAmount => this.totalAmount = totalAmount);
					this.isLoading = false;
					this.isDepositsLoading = false;
				}
			);
	}

	ngOnDestroy() { if (this.showDepositDialogSub) { this.showDepositDialogSub.unsubscribe(); } }

	openDialog(): MatDialogRef<ShowDepositDialogComponent> {
		return this.showDepositDialog
			.open(
				ShowDepositDialogComponent,
				{
					data: null,
					panelClass: 'custom-view-deposit-dialog-container',
					width: Constants.dialogDimensions.width
				}
			);
	}

	openShowDepositDialog(api: string): void {
		// TODO: use "api" to check for "api/save" or "api/spend"
		const dialogRef = this.openDialog();
		this.showDepositDialogSub = dialogRef
			.afterClosed()
			.subscribe(
				(deposit: IDeposit) => {
					log('dashboard.ts', this.openShowDepositDialog.name, 'Deposit from dialog:', deposit);
					if (deposit) {
						this.saveDeposit(deposit);
					}
				}
			);
	}

	saveDeposit(deposit: IDeposit): void {
		log('dashboard.ts', this.saveDeposit.name, 'deposit:', deposit);

		this.depositsService
			.postDeposit(deposit)
			.subscribe(() => { });
	}
}
