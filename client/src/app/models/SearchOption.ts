import { ISearchOption } from 'net-worth-shared';

export class SearchOption implements ISearchOption {
	owner!: string;
	currentMonth!: number;

	public constructor(partial?: Partial<SearchOption>) {
		Object.assign(this, partial);
	}
}
