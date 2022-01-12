import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// Interfaces:
import { IDeposit } from 'net-worth-shared';
// Models:
import { Currency } from 'net-worth-shared';
import { Deposit } from 'src/app/models/Deposit';
// Services:
import { CategoriesService } from 'src/app/services/categories.service';
import { CitiesService } from 'src/app/services/cities.service';
import { CurrenciesService } from 'src/app/services/currencies.service';
import { LocationsService } from 'src/app/services/locations.service';
// Shared:
import { Constants } from 'src/app/shared/Constants';
import { CATEGORIES } from 'src/app/shared/constants/Categories';
import { CITIES } from 'src/app/shared/constants/Cities';
import { LOCATIONS } from 'src/app/shared/constants/Locations';
import { log } from 'src/app/shared/Logger';

@Component({
	selector: 'app-show-deposit-dialog',
	templateUrl: './show-deposit-dialog.component.html',
	styleUrls: ['./show-deposit-dialog.component.scss']
})
export class ShowDepositDialogComponent implements OnInit {

	isInDebugMode: boolean = Constants.IN_DEBUG_MODE;

	canEdit: boolean = true;
	isFormReady: boolean = false;

	depositForm: FormGroup = new FormGroup({});

	constructor(
		@Inject(MAT_DIALOG_DATA) public deposit: IDeposit,
		public dialogReference: MatDialogRef<ShowDepositDialogComponent>,
		private categoriesService: CategoriesService,
		private citiesService: CitiesService,
		private currenciesService: CurrenciesService,
		private locationsService: LocationsService,
		private formBuilder: FormBuilder
	) {
		this.currencies = this.currenciesService.getCurrencies();
		this.categories = this.categoriesService.getCategories();
		this.cities = this.citiesService.getCities();
		this.locations = this.locationsService.getLocations();
	}

	recurrent: boolean = false;
	differentCurrency: boolean = false;
	selectedCurrency!: Currency;
	defaultFrequency = '';

	currencies: Currency[] = [];
	categories: CATEGORIES[] = [];
	cities: CITIES[] = [];
	locations: LOCATIONS[] = [];
	frequencies: string[] = ['week', 'month'];

	ngOnInit(): void {
		log('show-deposit-dialog.ts', this.ngOnInit.name, 'this.deposit:', this.deposit);
		this.initializeForm();
		this.depositForm.disable();

		this.isFormReady = true;
	}

	private initializeForm(): void {
		this.depositForm = this.formBuilder
			.group(
				{
					amount: [this.deposit.amount, Validators.required],
					details: [this.deposit.details, Validators.required],
					createdAt: [new Date(this.deposit.createdAt).toISOString().split('T')[0], Validators.required],
					category: [this.deposit.category, Validators.required],
					location: [this.deposit.location, Validators.required],
					city: [this.deposit.city, Validators.required],
					recurrent: [this.recurrent],
					frequency: [this.defaultFrequency],
					currencyCheck: [this.differentCurrency],
					currency: [this.deposit.currency],
					exchangeRate: [this.deposit.exchangeRate]
				}
			);
	}

	makeRecurrent(): void { this.recurrent = !this.recurrent; }
	changeCurrency(): void { this.differentCurrency = !this.differentCurrency; }

	edit(): void {
		this.canEdit = false;
		this.depositForm.enable();
	}

	isFormValid(): boolean {
		return this.depositForm.valid;
	}

	saveDeposit(): void {

		if (!this.isFormValid()) {
			this.dialogReference.close(null);
		} else {

			const depositFromForm = this.depositForm.value;
			const editedDeposit: IDeposit = new Deposit({
				owner: Constants.defaultOwner,
				amount: depositFromForm.amount,
				details: depositFromForm.details,
				createdAt: depositFromForm.createdAt,
				category: depositFromForm.category,
				location: depositFromForm.location,
				city: depositFromForm.city,
				recurrent: depositFromForm.recurrent,
				// frequency: depositFromForm.frequency,
				currency: depositFromForm.currency,
				exchangeRate: depositFromForm.exchangeRate,
			});

			log('show-deposit-dialog.ts', this.saveDeposit.name, 'editedDeposit:', editedDeposit);

			this.dialogReference.close(editedDeposit);
		}
	}

	depositChanged(): boolean {
		// TODO: need to check if there was a change in the form before issuing PUT request
		return true;
	}

	save(): void {
		if (this.depositChanged()) { this.saveDeposit(); }

		this.canEdit = true;
		this.depositForm.disable();
	}

}
