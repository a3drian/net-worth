import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// Interfaces:
import { IDeposit } from 'net-worth-shared';
// Models:
import { Control } from 'src/app/models/Control';
import { Currency } from 'net-worth-shared';
import { Deposit, DepositDifferences, DepositFromForm, DepositProperties } from 'src/app/models/Deposit';
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
import { CURRENCY } from 'net-worth-shared';
import { FREQUENCY } from 'src/app/shared/constants/Frequencies';
import { LOCATION } from 'src/app/shared/constants/Locations';
import { log } from 'src/app/shared/Logger';

@Component({
	selector: 'app-show-deposit-dialog',
	templateUrl: './show-deposit-dialog.component.html',
	styleUrls: ['./show-deposit-dialog.component.scss']
})
export class ShowDepositDialogComponent implements OnInit {

	CLASS_NAME = 'show-deposit-dialog.ts';

	isInDebugMode: boolean = Constants.IN_DEBUG_MODE;

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
		// TODO: fix default selected Currency
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
			currency: this.formDefaults.currency.symbol,
			exchangeRate: this.formDefaults.exchangeRate,
		});
		this.depositsService
			.postDeposit(deposit)
			.subscribe();
	}

	formDefaults = Constants.formDefaults;
	formPlaceholders = Constants.formPlaceholders;

	recurrent: boolean = Constants.formDefaults.recurrent;
	differentCurrency: boolean = Constants.formDefaults.differentCurrency;
	selectedCurrency: Currency = Constants.formDefaults.currency;
	defaultFrequency = Constants.formDefaults.frequency;

	rate: number = Constants.formDefaults.exchangeRate;
	showRate: boolean = false;

	currencies: Currency[] = [];
	categories: CATEGORY[] = [];
	cities: CITY[] = [];
	locations: LOCATION[] = [];
	frequencies: FREQUENCY[] = [];

	today: Date = new Date();

	titleText: string = '';
	amountErrorMessage: string = Constants.amountErrors.negativeValue;

	ngOnInit(): void {
		log(this.CLASS_NAME, this.ngOnInit.name, 'this.deposit:', this.deposit);

		// setTimeout(() => {
		this.deposit === null ? this.intializeAddPage() : this.initializeEditPage();
		// }, 750);
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
		this.initializeEditableForm();

		this.isFormReady = true;
	}

	private initializeEmptyForm(): void {
		this.depositForm = this.formBuilder
			.group(
				{
					amount: [
						this.formDefaults.amount,
						[Validators.required, Validators.min(0)]
					],
					details: [this.formDefaults.details, Validators.required],
					createdAt: [this.today.toISOString().split('T')[0], Validators.required],
					category: [this.formDefaults.category, Validators.required],
					location: [this.formDefaults.location, Validators.required],
					city: [this.formDefaults.city, Validators.required],
					recurrent: [this.formDefaults.recurrent],
					frequency: [this.formDefaults.frequency],
					differentCurrency: [this.formDefaults.differentCurrency],
					currency: [this.formDefaults.currency],
					exchangeRate: [this.formDefaults.exchangeRate, Validators.min(0)]
				}
			);
	}

	showFetchExchangeRateButton(): boolean {
		const defaultCurrency = this.selectedCurrency.name === CURRENCY.LEI.name ? true : false;
		return !this.showRate && !defaultCurrency;
	}

	private initializeEditableForm(): void {
		// necessary because "IDeposit" does not have a "differentCurrency" property
		const differentCurrency = this.deposit.currency === CURRENCY.LEI.symbol ? false : true;
		console.log('defaultCurrency:', differentCurrency);
		const currency = differentCurrency ? this.deposit.currency : CURRENCY.EUR;

		const amount = new FormControl(this.deposit.amount, [Validators.required, Validators.min(0)]);

		this.depositForm = this.formBuilder
			.group(
				{
					amount: amount,
					details: [this.deposit.details, Validators.required],
					createdAt: [new Date(this.deposit.createdAt).toISOString().split('T')[0], Validators.required],
					category: [this.deposit.category, Validators.required],
					location: [this.deposit.location, Validators.required],
					city: [this.deposit.city, Validators.required],
					recurrent: [this.deposit.recurrent],
					frequency: [this.deposit.frequency],
					differentCurrency: [differentCurrency],
					currency: [currency],
					exchangeRate: [this.deposit.exchangeRate, Validators.min(0)]
				}
			);
	}

	makeRecurrent(): void { this.recurrent = !this.recurrent; }

	private updateExchangeRate(rate: number): void {
		// still need to populate the form so the POST request will be successful
		const exchangeRate: AbstractControl | null = this.depositForm.get('exchangeRate');
		if (!exchangeRate) { return; }
		exchangeRate.setValue(rate);
		this.rate = rate;
		this.showRate = true;
	}

	fetchExchangeRate(c: Currency): void {
		const currency = c.name;
		const rate = this.getExchangeRate(currency);
		this.showRate = false;
		setTimeout(() => { this.updateExchangeRate(rate); }, 500);
	}

	private getExchangeRate(currency: string): number {
		switch (currency) {
			case (CURRENCY.EUR.name): { return 4.9; }
			case (CURRENCY.GBP.name): { return 5.8; }
			default: { return 1; }
		}
	}

	changeCurrency(): void {
		this.differentCurrency = !this.differentCurrency;
		this.showRate = false;
	}
	updateCurrency(c: Currency): void {
		log(this.CLASS_NAME, this.updateCurrency.name, 'c:', c);
		this.selectedCurrency = c;
		this.showRate = false;
	}

	private isFormValid(): boolean { return this.depositForm.valid; }

	private getDifferences(): DepositDifferences[] {
		const controls: Control[] = Object
			.entries(this.depositForm.controls)
			.map<Control>((c: [string, AbstractControl]) => {
				return { key: c[0] as DepositProperties, value: c[1].value, dirty: c[1].dirty, touched: c[1].touched }
			});

		const modifiedControls = controls.filter(c => c.dirty && c.touched);

		const differences = modifiedControls
			.map<DepositDifferences>(
				(c: Control) => {
					const k: DepositProperties = c.key;
					const oldValue = this.deposit[k];
					if (!oldValue) { return { key: c.key as DepositProperties, oldValue: '', newValue: c.value } }
					return { key: c.key as DepositProperties, oldValue: oldValue.toString(), newValue: c.value }
				});

		log(this.CLASS_NAME, this.getDifferences.name, 'controls:', controls);
		log(this.CLASS_NAME, this.getDifferences.name, 'differences:', differences);

		return differences;
	}

	private getDepositFromForm(): IDeposit {
		const formContents = this.depositForm.value;

		let depositFromForm = new DepositFromForm({
			amount: formContents.amount,
			details: formContents.details,
			createdAt: formContents.createdAt,
			category: formContents.category,
			location: formContents.location,
			city: formContents.city
		});

		const updatedDeposit: IDeposit = new Deposit({
			amount: formContents.amount,
			details: formContents.details,
			createdAt: formContents.createdAt,
			category: formContents.category,
			location: formContents.location,
			city: formContents.city,
			recurrent: formContents.recurrent,
			frequency: formContents.frequency,
			currency: formContents.currency,
			exchangeRate: formContents.exchangeRate,
		});

		log(this.CLASS_NAME, this.getDepositFromForm.name, 'depositFromForm:', updatedDeposit);
		return updatedDeposit;
	}

	private updateTotalAmount(oldValue: string, newValue: string): void {
		if (!oldValue || !newValue) { return; }
		let totalAmount = this.informationService.totalAmount.getValue();
		totalAmount = (totalAmount - Number(oldValue)) + Number(newValue);
		setTimeout(() => { this.informationService.totalAmount.next(totalAmount); }, Constants.updateTimeout);
	}

	private getUpdatedDeposit(): IDeposit {
		return <IDeposit>{};
	}

	private depositChanged(): boolean {
		const differences = this.getDifferences();
		if (differences.length === 0) { return false; }
		const amount: DepositDifferences = differences.filter((d) => d.key === 'amount')[0];
		const { oldValue, newValue } = amount;
		if (amount) { this.updateTotalAmount(oldValue, newValue); }
		return true;
	}

	private saveDeposit(updatedDeposit: IDeposit): void {
		if (!this.isFormValid()) {
			this.dialogReference.close(null);
		} else {
			log(this.CLASS_NAME, this.saveDeposit.name, 'updatedDeposit:', updatedDeposit);
			this.dialogReference.close(updatedDeposit);
		}
	}

	save(): void {
		const updatedDeposit: IDeposit = this.getDepositFromForm();
		if (this.depositChanged()) { this.saveDeposit(updatedDeposit); }
	}

	add(): void {
		const updatedDeposit: IDeposit = this.getDepositFromForm();
		this.updateTotalAmount('0', updatedDeposit.amount.toString());
		this.saveDeposit(updatedDeposit);
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
