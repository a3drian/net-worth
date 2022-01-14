import { Injectable } from '@angular/core';
// Shared:
import { CATEGORY } from '../shared/constants/Categories';

@Injectable({
	providedIn: 'root'
})
export class CategoriesService {

	categories: CATEGORY[] = Object.values(CATEGORY);

	constructor() { }

	getCategories(): CATEGORY[] {
		return this.categories;
	}
}
