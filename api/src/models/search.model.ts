import { ISearchOption } from '../interfaces/ISearchOption';

export class SearchOption implements ISearchOption {
	owner!: string;

	public constructor(partial?: Partial<ISearchOption>) {
		Object.assign(this, partial);
	}
}
