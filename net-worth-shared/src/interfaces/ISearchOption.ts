export interface ISearchOption {
	owner: string;
}

export interface ISearchOptionDateRange extends ISearchOption {
	from: Date;
	to: Date;
}
