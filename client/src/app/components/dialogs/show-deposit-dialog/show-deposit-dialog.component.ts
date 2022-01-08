import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// Interfaces:
import { CURRENCIES, Currency, IDeposit } from 'net-worth-shared';
import { Deposit } from 'src/app/models/Deposit';
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

	canEdit: boolean = false;
	ready: boolean = false;

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
		this.ready = true;
	}

	private initializeForm(): void {
		this.depositForm = this.formBuilder
			.group(
				{
					amount: [this.deposit.amount, Validators.required],
					details: [this.deposit.details],
					createdAt: [new Date(this.deposit.createdAt).toISOString().split('T')[0], Validators.required],
					category: [this.deposit.category],
					location: [this.deposit.location],
					city: [this.deposit.city],
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

	getConfirmation(confirmation: boolean): void {
		this.dialogReference.close(confirmation);
	}

	edit(): void {
		this.canEdit = !this.canEdit;
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
				owner: 'adi@foodspy.com',
				amount: depositFromForm.amount,
				details: depositFromForm.details,
				createdAt: depositFromForm.createdAt,
				category: depositFromForm.category,
				location: depositFromForm.location,
				city: depositFromForm.city,
				recurrent: depositFromForm.recurrent,
				// frequency: depositFromForm.frequency
				currency: CURRENCIES.LEI.name,
				exchangeRate: depositFromForm.exchangeRate,
			});

			log('show-deposit-dialog.ts', this.saveDeposit.name, 'editedDeposit:', editedDeposit);

			this.dialogReference.close(editedDeposit);
		}
	}

}
