export const getSpendingReport = (
	spendings: { year: number, month: number }[]
): Map<number, number[]> => {
	const spendingReport = new Map<number, number[]>();
	spendings.forEach((item) => {
		const { year, month } = item;
		if (spendingReport.has(year)) {
			const months = spendingReport.get(year);
			if (months) {
				if (!months.includes(month)) {
					months.push(month);
				}
			}
		} else {
			spendingReport.set(year, [month]);
		}
	});
	return spendingReport;
};

export const toMonthIndex = (month: string): number => {
	return (
		['January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December'
		].indexOf(month));
};

export const toMonthName = (month: number): string => {
	const date = new Date();
	date.setMonth(month - 1);

	return date.toLocaleString('en-UK', { month: 'long' });
};

const getSpendingYears = (spendingReport: Map<number, number[]>) => Array.from(spendingReport.keys());

const getSpendingMonths = (
	spendingReport: Map<number, number[]>,
	year: number
) => {
	const monthIndexes = spendingReport.get(year) as number[];
	const monthNames = monthIndexes.map((m) => m + 1).map((m) => toMonthName(m));
	return monthNames;
};
