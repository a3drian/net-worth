import { Injectable } from '@angular/core';
// Shared:
import { CATEGORIES } from '../shared/constants/Categories';

@Injectable({
	providedIn: 'root'
})
export class CategoriesService {

	categories: CATEGORIES[] = Object.values(CATEGORIES);

	constructor() { }

	getCategories(): CATEGORIES[] {
		return this.categories;
	}
}
