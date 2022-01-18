import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// Interfaces:
import { IDeposit } from 'net-worth-shared';
// Models:
import { Currency } from 'net-worth-shared';
import { Deposit, IDepositKVPairDiff } from 'src/app/models/Deposit';
// Services:
import { CategoriesService } from 'src/app/services/categories.service';
import { CitiesService } from 'src/app/services/cities.service';
import { CurrenciesService } from 'src/app/services/currencies.service';
import { DepositsService } from 'src/app/services/deposits.service';
import { FrequenciesService } from 'src/app/services/frequencies.service';
import { InformationService } from 'src/app/services/information.service';
import { LocationsService } from 'src/app/services/locations.service';
// Shared:
import { Constants } from 'src/app/shared/Constants';
import { CATEGORY } from 'src/app/shared/constants/Categories';
import { CITY } from 'src/app/shared/constants/Cities';
import { FREQUENCY } from 'src/app/shared/constants/Frequencies';
import { LOCATION } from 'src/app/shared/constants/Locations';
import { log } from 'src/app/shared/Logger';

@Component({
	selector: 'app-show-deposit-dialog',
	templateUrl: './show-deposit-dialog.component.html',
	styleUrls: ['./show-deposit-dialog.component.scss']
})
export class ShowDepositDialogComponent implements OnInit {

	isInDebugMode: boolean = Constants.IN_DEBUG_MODE;

	canEdit: boolean = true;
	inEditMode: boolean = false;
	isFormReady: boolean = false;

	depositForm: FormGroup = new FormGroup({});

	constructor(
		@Inject(MAT_DIALOG_DATA) public deposit: IDeposit,
		public dialogReference: MatDialogRef<ShowDepositDialogComponent>,
		private categoriesService: CategoriesService,
		private citiesService: CitiesService,
		private currenciesService: CurrenciesService,
		private locationsService: LocationsService,
		private frequenciesService: FrequenciesService,
		private formBuilder: FormBuilder,
		private informationService: InformationService,
		private depositsService: DepositsService
	) {
		this.currencies = this.currenciesService.getCurrencies();
		this.categories = this.categoriesService.getCategories();
		this.cities = this.citiesService.getCities();
		this.locations = this.locationsService.getLocations();
		this.frequencies = this.frequenciesService.getFrequencies();
	}

	spendDeposit(): void {
		const depositFromForm = this.depositForm.value;
		// if (!this.validDepositFromForm(depositFromForm)) { return; }

		const deposit: IDeposit = new Deposit({
			owner: this.informationService.owner.value,
			amount: depositFromForm.amount,
			details: depositFromForm.details,
			createdAt: depositFromForm.createdAt,
			category: depositFromForm.category,
			location: depositFromForm.location,
			city: depositFromForm.city,
			// TODO: get actual values
			recurrent: this.formDefaults.recurrent,
			frequency: this.formDefaults.frequency,
			currency: this.formDefaults.currency,
			exchangeRate: this.formDefaults.exchangeRate,
		});
		this.depositsService
			.postDeposit(deposit)
			.subscribe();
	}

	recurrent: boolean = false;
	differentCurrency: boolean = false;
	selectedCurrency!: Currency;
	defaultFrequency = '';

	currencies: Currency[] = [];
	categories: CATEGORY[] = [];
	cities: CITY[] = [];
	locations: LOCATION[] = [];
	frequencies: FREQUENCY[] = [];

	today: Date = new Date();

	titleText: string = '';
	amountErrorMessage: string = Constants.amountErrors.negativeValue;

	formDefaults = Constants.formDefaults;
	formPlaceholders = Constants.formPlaceholders;

	ngOnInit(): void {
		log('show-deposit-dialog.ts', this.ngOnInit.name, 'this.deposit:', this.deposit);

		this.deposit === null ? this.intializeAddPage() : this.initializeEditPage();
	}

	private intializeAddPage(): void {
		this.titleText = 'Add new';
		this.inEditMode = false;
		this.initializeEmptyForm();

		this.isFormReady = true;
	}

	private initializeEditPage(): void {
		this.titleText = 'View or edit';
		this.inEditMode = true;
		this.initializeForm();

		this.isFormReady = true;
	}

	private initializeEmptyForm(): void {
		this.depositForm = this.formBuilder
			.group(
				{
					amount: [this.formDefaults.amount, Validators.required],
					details: [this.formDefaults.details, Validators.required],
					createdAt: [this.today.toISOString().split('T')[0], Validators.required],
					category: [this.formDefaults.category, Validators.required],
					location: [this.formDefaults.location, Validators.required],
					city: [this.formDefaults.city, Validators.required],
					recurrent: [this.formDefaults.recurrent],
					frequency: [this.formDefaults.frequency],
					currencyCheck: [this.formDefaults.currencyCheck],
					currency: [this.formDefaults.currency],
					exchangeRate: [this.formDefaults.exchangeRate]
				}
			);
	}

	private initializeForm(): void {
		this.depositForm = this.formBuilder
			.group(
				{
					amount: [
						this.deposit.amount,
						[Validators.required, Validators.min(0)]
					],
					details: [this.deposit.details, Validators.required],
					createdAt: [new Date(this.deposit.createdAt).toISOString().split('T')[0], Validators.required],
					category: [this.deposit.category, Validators.required],
					location: [this.deposit.location, Validators.required],
					city: [this.deposit.city, Validators.required],
					recurrent: [this.deposit.recurrent],
					frequency: [this.deposit.frequency],
					currencyCheck: [this.differentCurrency],
					currency: [this.deposit.currency],
					exchangeRate: [this.deposit.exchangeRate]
				}
			);
	}

	makeRecurrent(): void { this.recurrent = !this.recurrent; }
	changeCurrency(): void { this.differentCurrency = !this.differentCurrency; }

	private enableEdit(): void {
		this.canEdit = false;
		this.depositForm.enable();
	}

	private disableEdit(): void {
		this.canEdit = true;
		this.depositForm.disable();
	}

	add(): void {
		const editedDeposit: IDeposit = this.getDepositFromForm();
		this.updateTotalAmount('0', editedDeposit.amount.toString());
		this.saveDeposit(editedDeposit);
		this.enableEdit();
	}
	edit(): void { this.enableEdit(); }
	cancel(): void { this.disableEdit(); }

	private isFormValid(): boolean {
		return this.depositForm.valid;
	}

	private saveDeposit(editedDeposit: IDeposit): void {
		if (!this.isFormValid()) {
			this.dialogReference.close(null);
		} else {
			log('show-deposit-dialog.ts', this.saveDeposit.name, 'editedDeposit:', editedDeposit);
			this.dialogReference.close(editedDeposit);
		}
	}

	private getDepositFromForm(): IDeposit {
		const depositFromForm = this.depositForm.value;
		const editedDeposit: IDeposit = new Deposit({
			owner: this.informationService.owner.value,
			amount: depositFromForm.amount,
			details: depositFromForm.details,
			createdAt: depositFromForm.createdAt,
			category: depositFromForm.category,
			location: depositFromForm.location,
			city: depositFromForm.city,
			recurrent: depositFromForm.recurrent,
			frequency: depositFromForm.frequency,
			currency: depositFromForm.currency,
			exchangeRate: depositFromForm.exchangeRate,
		});
		return editedDeposit;
	}

	private depositChanged(editedDeposit: IDeposit): boolean {
		const d1 = this.depositsService.getDepositKVPair(this.deposit);
		const d2 = this.depositsService.getDepositKVPair(editedDeposit);
		const differences = this.depositsService.getDepositKVPairDifferences(d1, d2);
		if (differences.length === 0) { return false; }
		const amount: IDepositKVPairDiff = differences.filter((d) => d.key === 'amount')[0];
		const { oldValue, newValue } = amount;
		if (amount) { this.updateTotalAmount(oldValue, newValue); }
		return true;
	}

	private updateTotalAmount(oldValue: string, newValue: string): void {
		if (!oldValue || !newValue) { return; }
		let totalAmount = this.informationService.totalAmount.getValue();
		totalAmount = (totalAmount - Number(oldValue)) + Number(newValue);
		setTimeout(() => { this.informationService.totalAmount.next(totalAmount); }, Constants.updateTimeout);
	}

	save(): void {
		const editedDeposit: IDeposit = this.getDepositFromForm();
		if (this.depositChanged(editedDeposit)) {
			this.saveDeposit(editedDeposit);
		}

		this.disableEdit();
	}

	// Form validation:
	isInputValid(inputName: string): boolean {
		// this.initializeError(inputName);
		return this.depositForm.controls[`${inputName}`].valid;
	}

	/*
	initializeError(inputName: string): void {
		if (inputName === 'amount') {
			const input = this.depositForm.controls[`${inputName}`];
			const inputValue: number | string = input.value;
			console.log('inputValue:', inputValue);
			if (inputValue === null) {
				console.log('input is NULL:', input);
				this.amountErrorMessage = this.amountErrors.empty;
				return;
			}
			if (inputValue < 0) {
				this.amountErrorMessage = this.amountErrors.negativeValue;
			} else if (inputValue.toString().includes(',')) {
				this.amountErrorMessage = this.amountErrors.invalidDecimalSeparator;
			} else if (inputValue.toString().length === 0) {
				this.amountErrorMessage = this.amountErrors.empty;
			} else if (inputValue.toString().includes('#')) {
				this.amountErrorMessage = this.amountErrors.invalidCharacters;
			}
		}
	}
	*/
}
