export const getSpendingReport = (spendings: { year: number, month: number }[]) => {
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
