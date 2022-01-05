import { Injectable } from '@angular/core';
// Shared:
import { CATEGORIES } from '../shared/constants/Categories';

@Injectable({
	providedIn: 'root'
})
export class CategoriesService {

	categories = [
		CATEGORIES.DINING,
		CATEGORIES.FINANCES,
		CATEGORIES.GROCERIES,
		CATEGORIES.HOUSEHOLD,
		CATEGORIES.SERVICES,
		CATEGORIES.SHOPPING,
		CATEGORIES.TRANSPORTATION,
		CATEGORIES.TRAVEL,
		CATEGORIES.UTILITIES,
		CATEGORIES.OTHER,
	];

	constructor() { }

	getCategories(): CATEGORIES[] {
		return this.categories;
	}
}
