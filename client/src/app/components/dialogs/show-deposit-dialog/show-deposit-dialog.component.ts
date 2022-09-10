import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// Interfaces:
import { IControl } from 'src/app/models/Control';
import { IDeposit } from 'net-worth-shared';
// Models:
import { DepositDifferences, DepositDTO, DepositProperties, DepositValues } from 'src/app/models/Deposit';
// rxjs:
import { BehaviorSubject } from 'rxjs';
// Services:
import { CategoriesService } from 'src/app/services/categories.service';
import { CurrenciesService } from 'src/app/services/currencies.service';
import { InformationService } from 'src/app/services/information.service';
// Validators:
import { positiveNumberValidator } from 'src/app/shared/validators/positiveNumberValidator';
// Shared:
import { Constants } from 'src/app/shared/Constants';
import { CATEGORY } from 'src/app/shared/constants/Categories';
import { CURRENCY } from 'src/app/shared/constants/Currencies';
import { log } from 'src/app/shared/Logger';

@Component({
	selector: 'app-show-deposit-dialog',
	templateUrl: './show-deposit-dialog.component.html',
	styleUrls: ['./show-deposit-dialog.component.scss']
})
export class ShowDepositDialogComponent implements OnInit {

	isInDebugMode: boolean = Constants.IN_DEBUG_MODE;

	CLASS_NAME = 'show-deposit-dialog.ts';

	inEditMode: boolean = false;
	isFormReady: boolean = false;

	canSubmit: boolean = true;

	depositForm: FormGroup = new FormGroup({});

	formDefaults = Constants.formDefaults;
	formPlaceholders = Constants.formPlaceholders;

	categories: CATEGORY[] = [];
	currencies: CURRENCY[] = [];

	today: Date = new Date();

	titleText: string = '';

	amountErrors = Constants.amountErrors;
	detailsErrors = Constants.detailsErrors;
	amountErrorMessage: string = Constants.amountErrors.empty;
	detailsErrorMessage: string = Constants.detailsErrors.empty;

	depositChanged = new BehaviorSubject<boolean>(false);

	constructor(
		@Inject(MAT_DIALOG_DATA) public deposit: IDeposit,
		public dialogReference: MatDialogRef<ShowDepositDialogComponent>,
		private formBuilder: FormBuilder,
		private informationService: InformationService,
		private categoriesService: CategoriesService,
		private currenciesService: CurrenciesService
	) {
		this.categories = this.categoriesService.getCategories();
		this.currencies = this.currenciesService.getCurrencies();
	}

	ngOnInit(): void {
		// setTimeout(() => {
		this.deposit === null ? this.intializeAddPage() : this.initializeEditPage();
		// }, 750);
		this.formValueChanged();
	}

	isFormValid(): boolean { return this.depositForm.valid; }

	save(): void {
		const updatedDeposit: IDeposit = this.getFormContents(this.deposit);
		this.updateTotalAmount(this.deposit.amount.toString(), updatedDeposit.amount.toString());
		const changed = this.depositChanged.getValue();
		if (changed) { this.saveDeposit(updatedDeposit); }
	}

	add(): void {
		const newDeposit: IDeposit = this.getFormContents(null);
		this.updateTotalAmount('0', newDeposit.amount.toString());
		this.saveDeposit(newDeposit);
	}

	// Form validation:
	isInputValid(inputName: string): boolean {
		return this.depositForm.controls[`${inputName}`].valid;
	}

	isAmountValid(): boolean {
		const control = this.depositForm.controls['amount'];
		const errors = control.errors;
		if (!errors) { return true; }
		const required = errors['required'];
		if (required) { this.amountErrorMessage = this.amountErrors.empty; }
		const negative = errors['negative'];
		if (negative) { this.amountErrorMessage = this.amountErrors.negativeValue; }
		return control.valid;
	}

	isDetailsValid(): boolean {
		const control = this.depositForm.controls['details'];
		const errors = control.errors;
		if (!errors) { return true; }
		const required = errors['required'];
		if (required) { this.detailsErrorMessage = this.detailsErrors.empty; }
		const tooLong = errors['maxlength'];
		if (tooLong) { this.detailsErrorMessage = this.detailsErrors.tooLong; }
		return control.valid;
	}

	hasDepositChanged(): boolean {
		if (this.isFormValid()) {
			if (this.depositChanged.getValue() === true) {
				return true;
			}
		}
		return false;
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

	private initializeDepositForm(
		initial: IDeposit | { amount: number, currency: CURRENCY, details: string, category: CATEGORY, refundable: boolean, refunded: boolean },
		initialDate: Date
	): void {

		const amount = new FormControl(initial.amount, [Validators.required, Validators.min(0), positiveNumberValidator()]);
		const currency = new FormControl(initial.currency, [Validators.required]);
		const details = new FormControl(initial.details, [Validators.required, Validators.maxLength(20)]);
		const createdAt = new FormControl(initialDate.toISOString().split('T')[0], [Validators.required]);
		const category = new FormControl(initial.category, [Validators.required]);
		const refundable = new FormControl(initial.refundable);
		const refunded = new FormControl(initial.refunded);

		this.depositForm = this.formBuilder
			.group(
				{
					amount: amount,
					currency: currency,
					details: details,
					createdAt: createdAt,
					category: category,
					refundable: refundable,
					refunded: refunded
				}
			);
	}

	private initializeEmptyForm(): void {
		this.initializeDepositForm(this.formDefaults, this.today);
		log(this.CLASS_NAME, this.initializeEmptyForm.name, 'initialized empty form:', this.depositForm.value);
	}

	private initializeEditableForm(): void {
		this.initializeDepositForm(this.deposit, new Date(this.deposit.createdAt));
		log(this.CLASS_NAME, this.initializeEditableForm.name, 'initialized editable form:', this.depositForm.value);
	}

	private updateTotalAmount(oldValue: string, newValue: string): void {
		if (!oldValue || !newValue) { return; }
		let totalAmount = this.informationService.totalAmount.getValue();
		totalAmount = (totalAmount - Number(oldValue)) + Number(newValue);
		setTimeout(() => { this.informationService.totalAmount.next(totalAmount); }, Constants.updateTimeout);
	}

	private getDifferences(deposit: IDeposit | null): DepositDifferences[] {
		const controls: IControl[] = Object
			.entries(this.depositForm.controls)
			.map<IControl>((c: [string, AbstractControl]) => {
				return {
					key: c[0] as DepositProperties, value: c[1].value as DepositValues,
					dirty: c[1].dirty, touched: c[1].touched, valid: c[1].valid
				};
			});

		if (deposit) {
			const modifiedControls = controls.filter(c => c.dirty && c.touched);

			const differences = modifiedControls
				.map<DepositDifferences>(
					(c: IControl) => {
						const k: DepositProperties = c.key;
						const oldValue = deposit[k];
						const v: DepositValues = c.value;
						if (!oldValue) {
							return {
								key: k as DepositProperties,
								oldValue: '' as DepositValues,
								newValue: v as DepositValues
							};
						}
						return {
							key: k as DepositProperties,
							oldValue: oldValue as DepositValues,
							newValue: v as DepositValues
						};
					});

			// log(this.CLASS_NAME, this.getDifferences.name, 'controls:', controls);
			// log(this.CLASS_NAME, this.getDifferences.name, 'differences:', differences);

			return differences;
		} else {
			// TODO: better filtering
			const modifiedControls = controls.filter(c => c.valid);

			const differences = modifiedControls
				.map<DepositDifferences>(
					(c: IControl) => {
						const k: DepositProperties = c.key;
						const v: DepositValues = c.value;
						return {
							key: k as DepositProperties,
							oldValue: '' as DepositValues,
							newValue: v as DepositValues
						};
					});

			// log(this.CLASS_NAME, this.getDifferences.name, 'controls:', controls);
			// log(this.CLASS_NAME, this.getDifferences.name, 'differences:', differences);

			return differences;
		}
	}

	private getFormDifferences(deposit: IDeposit | null) {
		const differences = this.getDifferences(deposit);
		if (differences.length === 0) {
			this.depositChanged.next(false);
			return deposit;
		}

		log(this.CLASS_NAME, this.getFormDifferences.name, 'differences:', differences);

		this.depositChanged.next(true);

		// TODO: always check if types match with "IDeposit" types
		const depositDifferences: { [key: string]: DepositValues } = {};

		differences.forEach((diff: DepositDifferences) => {
			const key = diff.key;
			const value = diff.newValue;
			depositDifferences[key] = value;
		});

		depositDifferences['owner'] = this.informationService.owner.value;

		log(this.CLASS_NAME, this.getFormDifferences.name, 'final differences:', depositDifferences);
		return depositDifferences;
	}

	private getUpdatedDeposit(deposit: DepositDTO): IDeposit {
		const updatedDeposit = <IDeposit>{
			_id: this.deposit._id,	// after "Save", DELETE request fails because "id" is "undefined"
			owner: deposit.owner ?? this.deposit.owner,
			amount: deposit.amount ?? this.deposit.amount,
			currency: deposit.currency ?? this.deposit.currency,
			details: deposit.details ?? this.deposit.details,
			createdAt: deposit.createdAt ?? this.deposit.createdAt,
			category: deposit.category ?? this.deposit.category,
			refundable: deposit.refundable ?? this.deposit.refundable,
			refunded: deposit.refunded ?? this.deposit.refunded
		};
		return updatedDeposit;
	}

	private getFormContents(deposit: IDeposit | null): IDeposit {

		const depositDifferences = deposit ? this.getFormDifferences(deposit) : this.getFormDifferences(null);
		const depositFromForm: DepositDTO = depositDifferences as DepositDTO;

		if (deposit) {

			const updatedDeposit = this.getUpdatedDeposit(depositFromForm);

			log(this.CLASS_NAME, this.getFormContents.name, 'updated depositFromForm:', updatedDeposit);
			return updatedDeposit;
		} else {

			const newDeposit = depositFromForm as IDeposit;

			log(this.CLASS_NAME, this.getFormContents.name, 'new depositFromForm:', newDeposit);
			return newDeposit;
		}
	}

	private formValueChanged() {
		this.depositForm
			.valueChanges
			.subscribe(
				selectedValue => {
					log(this.CLASS_NAME, this.formValueChanged.name, 'selectedValue:', selectedValue);
					this.depositChanged.next(true);
				}
			);
	}

	private saveDeposit(updatedDeposit: IDeposit): void {
		if (!this.isFormValid()) {
			this.dialogReference.close(null);
		} else {
			log(this.CLASS_NAME, this.saveDeposit.name, 'updatedDeposit:', updatedDeposit);
			this.dialogReference.close(updatedDeposit);
		}
	}
}
