import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
// Components
import { DeleteDepositDialogComponent } from '../../dialogs/delete-deposit-dialog/delete-deposit-dialog.component';
import { ShowDepositDialogComponent } from '../../dialogs/show-deposit-dialog/show-deposit-dialog.component';
// Interfaces:
import { IDeposit } from 'net-worth-shared';
// Services:
import { DepositsService } from 'src/app/services/deposits.service';
// Shared:
import { Constants } from 'src/app/shared/Constants';
import { log } from 'src/app/shared/Logger';

@Component({
	selector: 'app-deposit-card',
	templateUrl: './deposit-card.component.html',
	styleUrls: ['./deposit-card.component.scss']
})
export class DepositCardComponent implements OnInit {

	isInDebugMode: boolean = !Constants.IN_DEBUG_MODE;

	@Input()
	deposit: IDeposit = <IDeposit>{};

	deleted: boolean = false;

	deleteDepositDialogSub: Subscription = new Subscription();
	showDepositDialogSub: Subscription = new Subscription();

	constructor(
		private router: Router,
		private depositsService: DepositsService,
		public deleteDepositDialog: MatDialog,
		public showDepositDialog: MatDialog,
	) { }

	ngOnInit(): void { }

	ngOnDestroy() {
		if (this.deleteDepositDialogSub) { this.deleteDepositDialogSub.unsubscribe(); }
		if (this.showDepositDialogSub) { this.showDepositDialogSub.unsubscribe(); }
	}

	deleteDeposit(deposit: IDeposit): void {
		log('deposit-card.ts', this.deleteDeposit.name, 'deposit:', deposit._id);

		this.deleted = !this.deleted;

		this.depositsService
			.deleteDeposit(deposit._id)
			.subscribe();
	}

	navigateToSpendPage(): void {
		const spendUrl = Constants.appEndpoints.SPEND_URL;
		this.router
			.navigateByUrl(spendUrl)
			.catch((error) => { log('deposit-card.ts', this.navigateToSpendPage.name, `Could not navigate to: ${spendUrl}`, error); });
	}

	viewDeposit(deposit: IDeposit): void {
		log('deposit-card.ts', this.viewDeposit.name, 'deposit:', deposit._id);

		const viewUrl = `${Constants.appEndpoints.VIEW_URL}/${deposit._id}`;
		this.router
			.navigateByUrl(viewUrl)
			.catch((error) => { log('deposit-card.ts', this.navigateToSpendPage.name, `Could not navigate to: ${viewUrl}`, error); });
	}

	saveDeposit(deposit: IDeposit): void {

	}

	openShowDepositDialog(deposit: IDeposit): void {
		log('deposit-card.ts', this.openShowDepositDialog.name, 'Selected deposit:', deposit);

		const dialogRef = this.showDepositDialog
			.open(
				ShowDepositDialogComponent,
				{
					data: deposit,
					panelClass: 'custom-view-deposit-dialog-container',
					height: '500px',
					width: '400px'
				}
			);
		this.showDepositDialogSub = dialogRef
			.afterClosed()
			.subscribe(
				(canEdit: boolean) => {
					log('deposit-card.ts', this.openShowDepositDialog.name, 'canEdit:', canEdit);
					if (canEdit) {
						this.saveDeposit(deposit);
					}
				}
			);
	}

	openDeleteDepositDialog(deposit: IDeposit): void {
		log('deposit-card.ts', this.openDeleteDepositDialog.name, 'Selected deposit:', deposit);

		const dialogRef = this.deleteDepositDialog
			.open(
				DeleteDepositDialogComponent,
				{
					data: deposit,
					panelClass: 'custom-delete-deposit-dialog-container',
					height: '200px',
					width: '400px'
				}
			);
		this.deleteDepositDialogSub = dialogRef
			.afterClosed()
			.subscribe(
				(canDelete: boolean) => {
					log('deposit-card.ts', this.openDeleteDepositDialog.name, 'canDelete:', canDelete);
					if (canDelete) {
						this.deleteDeposit(deposit);
					}
				}
			);
	}

}
