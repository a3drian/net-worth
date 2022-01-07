import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// Interfaces:
import { IDeposit } from 'net-worth-shared';
// Models:
import { Currency } from 'net-worth-shared';
import { Deposit } from 'src/app/models/Deposit';
// Services:
import { CategoriesService } from 'src/app/services/categories.service';
import { CitiesService } from 'src/app/services/cities.service';
import { CurrenciesService } from 'src/app/services/currencies.service';
import { DepositsService } from 'src/app/services/deposits.service';
import { LocationsService } from 'src/app/services/locations.service';
// Shared:
import { Constants } from 'src/app/shared/Constants';
import { CATEGORIES } from 'src/app/shared/constants/Categories';
import { CITIES } from 'src/app/shared/constants/Cities';
import { CURRENCIES } from 'net-worth-shared';
import { LOCATIONS } from 'src/app/shared/constants/Locations';

@Component({
	selector: 'app-spend',
	templateUrl: './spend.component.html',
	styleUrls: ['./spend.component.scss']
})
export class SpendComponent implements OnInit {

	isInDebugMode: boolean = Constants.IN_DEBUG_MODE;

	DASHBOARD_URL = '/' + Constants.appEndpoints.DASHBOARD_URL;

	depositForm: FormGroup = new FormGroup({});
	canEdit: boolean = false;
	ready: boolean = false;

	recurrent: boolean = false;
	differentCurrency: boolean = false;
	selectedCurrency!: Currency;

	currencies: Currency[] = [];
	categories: CATEGORIES[] = [];
	cities: CITIES[] = [];
	locations: LOCATIONS[] = [];
	frequencies: string[] = ['week', 'month'];

	defaultAmount = 10;
	defaultDetails = '';
	defaultDetailsPlaceholder = 'Eg. weekly groceries';
	defaultCurrency = CURRENCIES.LEI;
	defaultCreatedAt = new Date().toISOString().split('T')[0];
	defaultExchangeRate = 1;
	defaultCategory = CATEGORIES.GROCERIES;
	defaultLocation = LOCATIONS.SELGROS;
	defaultCity = CITIES.BRASOV;
	defaultFrequency = '';

	constructor(
		private depositsService: DepositsService,
		private categoriesService: CategoriesService,
		private citiesService: CitiesService,
		private currenciesService: CurrenciesService,
		private locationsService: LocationsService,
		private formBuilder: FormBuilder,
		private router: Router
	) {

		this.currencies = this.currenciesService.getCurrencies();
		this.categories = this.categoriesService.getCategories();
		this.cities = this.citiesService.getCities();
		this.locations = this.locationsService.getLocations();

		this.initializeForm();
	}

	private initializeForm(): void {
		this.depositForm = this.formBuilder
			.group(
				{
					amount: [this.defaultAmount, Validators.required],
					details: [this.defaultDetails, Validators.required],
					createdAt: [this.defaultCreatedAt, Validators.required],
					category: [this.defaultCategory, Validators.required],
					location: [this.defaultLocation, Validators.required],
					city: [this.defaultCity, Validators.required],
					recurrent: [this.recurrent],
					frequency: [this.defaultFrequency],
					currencyCheck: [this.differentCurrency],
					currency: [this.defaultCurrency],
					exchangeRate: [this.defaultExchangeRate]
				}
			);
	}

	enableEditing(): void {
		this.canEdit = !this.canEdit;
	}

	save(): void {
		this.canEdit = !this.canEdit;
	}

	updateCurrency(c: Currency) {
		this.selectedCurrency = c;
	}

	ngOnInit(): void { }

	makeRecurrent(): void { this.recurrent = !this.recurrent; }
	changeCurrency(): void { this.differentCurrency = !this.differentCurrency; }

	validDepositFromForm(deposit: IDeposit): boolean {
		if (deposit.details.length === 0) { deposit.details = '...'; }
		return true;
	}

	spendDeposit(): void {
		const depositFromForm = this.depositForm.value;
		if (!this.validDepositFromForm(depositFromForm)) { return; }

		const deposit: IDeposit = new Deposit({
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
		this.depositsService
			.postDeposit(deposit)
			.subscribe();
	}

	redirect(): void {
		this.router.navigate([this.DASHBOARD_URL]);
	}

}
