import { ISearchOption } from 'net-worth-shared';

export class SearchOption implements ISearchOption {
	owner!: string;

	public constructor(partial?: Partial<ISearchOption>) {
		Object.assign(this, partial);
	}
}
