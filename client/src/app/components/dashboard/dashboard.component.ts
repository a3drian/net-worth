import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
// Components:
import { ShowDepositDialogComponent } from '../dialogs/show-deposit-dialog/show-deposit-dialog.component';
// Interfaces:
import { IDeposit } from 'net-worth-shared';
import { IUser } from 'src/app/interfaces/IUser';
// Models:
import { Currency } from 'src/app/models/Currency';
// rxjs:
import { BehaviorSubject, merge, Subscription, switchMap } from 'rxjs';
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
	isLoading: boolean = true;
	isDepositsLoading: boolean = false;

	errorResponse: HttpErrorResponse | null = null;
	today: Date = new Date();

	spendingForm: FormGroup = new FormGroup({});
	years!: number[];
	months!: string[];
	showFilters = false;

	selectedYear!: number;
	selectedMonth!: string;

	deposits: IDeposit[] = [];
	totalAmount: Currency = { LEI: 0, EUR: 0, GBP: 0, USD: 0 };
	anyMoneySpent: boolean = false;

	owner: string = '';
	user: IUser | null = null;
	showDepositDialogSub: Subscription = new Subscription();

	refreshDeposits$ = new BehaviorSubject(false);
	private get refreshDeposits(): boolean {
		return this.refreshDeposits$.value;
	}
	private set refreshDeposits(value: boolean) {
		this.refreshDeposits$.next(value);
	}

	constructor(
		private depositsService: DepositsService,
		private formBuilder: FormBuilder,
		private informationService: InformationService,
		public showDepositDialog: MatDialog,
		private authService: AuthService
	) {
		this.owner = this.informationService.owner();
		this.selectedYear = Number(this.today.getFullYear().toString().substring(2));
		this.selectedMonth = this.toMonthName(this.today.getMonth() + 1);
		this.user = this.authService.user$.value;

		const years = new FormControl<number>(this.today.getFullYear(), [Validators.required]);
		const months = new FormControl<string>(this.toMonthName(this.today.getMonth() + 1), [Validators.required]);
		this.spendingForm = this.formBuilder.group({ years: years, months: months });
	}

	ngOnInit(): void {
		this.depositsService
			.getSpending(this.owner)
			.subscribe(
				(spending: { years: number[], months: number[] }) => {
					log('dashboard.ts', this.ngOnInit.name, 'Spending:', spending);
					this.years = spending.years;
					this.months = spending.months.map(m => m + 1).map(m => this.toMonthName(m));
					this.isLoading = false;
				}
			);

		merge(this.refreshDeposits$)
			.pipe(switchMap(() => {
				this.isDepositsLoading = true;
				return this.depositsService.getDepositsByOwnerYearMonth(this.owner, this.today.getFullYear(), this.today.getMonth());
			}))
			.subscribe((deposits: IDeposit[]) => this.loadDeposits(deposits));
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
			.subscribe(() => this.refreshDeposits = true);
	}

	openFilters(): void {
		this.showFilters = !this.showFilters;
	}

	onFilterChange(): void {
		const yearValue = this.spendingForm.controls['years'].value;
		const monthValue = this.spendingForm.controls['months'].value;
		const year = Number(yearValue);
		const month = this.toMonthIndex(monthValue);

		this.selectedYear = Number(yearValue.toString().substring(2));
		this.selectedMonth = monthValue;

		log('dashboard.ts', this.saveDeposit.name, 'year', yearValue);
		log('dashboard.ts', this.saveDeposit.name, 'month', monthValue);

		merge(this.refreshDeposits$)
			.pipe(switchMap(() => {
				this.isDepositsLoading = true;
				return this.depositsService.getDepositsByOwnerYearMonth(this.owner, year, month);
			}))
			.subscribe((deposits: IDeposit[]) => this.loadDeposits(deposits));
	}

	private loadDeposits(deposits: IDeposit[]): void {
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

		this.updateInformationService();

		setTimeout(() => { this.isDepositsLoading = false; }, Constants.updateTimeout);
	}

	private updateInformationService(): void {
		this.informationService.totalAmount$.next(this.totalAmount);
		this.informationService.totalAmount$.subscribe(totalAmount => this.totalAmount = totalAmount);
	}

	private toMonthIndex(month: string) {
		return (
			['January',
				'February',
				'March',
				'April',
				'May',
				'June',
				'July',
				'August',
				'September',
				'October',
				'November',
				'December'
			].indexOf(month));
	}

	private toMonthName(month: number) {
		const date = new Date();
		date.setMonth(month - 1);

		return date.toLocaleString('en-UK', { month: 'long' });
	}
}
