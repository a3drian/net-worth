import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// Interfaces:
import { IDeposit } from 'net-worth-shared';
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
		public dialogReference: MatDialogRef<DeleteDepositDialogComponent>
	) { }

	ngOnInit(): void { }

	getConfirmation(confirmation: boolean): void {
		this.dialogReference.close(confirmation);
	}
}
