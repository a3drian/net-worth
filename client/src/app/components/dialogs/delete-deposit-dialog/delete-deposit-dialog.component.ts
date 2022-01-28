import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// Interfaces:
import { IDeposit } from 'net-worth-shared';
// Services:
import { InformationService } from 'src/app/services/information.service';
// Shared:
import { Constants } from 'src/app/shared/Constants';

@Component({
	selector: 'app-delete-deposit-dialog',
	templateUrl: './delete-deposit-dialog.component.html',
	styleUrls: ['./delete-deposit-dialog.component.scss']
})
export class DeleteDepositDialogComponent implements OnInit {

	isInDebugMode: boolean = Constants.IN_DEBUG_MODE;

	constructor(
		@Inject(MAT_DIALOG_DATA) public deposit: IDeposit,
		public dialogReference: MatDialogRef<DeleteDepositDialogComponent>,
		private informationService: InformationService
	) { }

	ngOnInit(): void { }

	getConfirmation(confirmation: boolean): void {
		if (confirmation === true) { this.updateTotalAmount(); }
		this.dialogReference.close(confirmation);
	}

	private updateTotalAmount(): boolean {
		let totalAmount = this.informationService.totalAmount.getValue();
		totalAmount = totalAmount - this.deposit.amount;
		setTimeout(() => { this.informationService.totalAmount.next(totalAmount); }, Constants.updateTimeout);
		return true;
	}
}
