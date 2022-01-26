// Shared:
import { Constants } from './Constants';

export { log };

const padding = 3;
const padded = `display: inline-block; padding: ${padding}px`;
const big = 'font-size: 12px;' + padded;
const blackBkg = 'background-color: black; color: white;' + big + padded;
const blueBkg = 'background-color: blue; color: white;' + big + padded;
const greenBkg = 'background-color: green; color: white;' + padded;

const log = function (
	className: string,
	caller: string,
	message: string,
	object?: any
): void {
	if (Constants.IN_DEBUG_MODE) {
		if (!(caller.includes('(') || caller.includes(')'))) {
			caller = caller + '()';
		}
		if (caller.includes('^')) {
			caller = caller.replace('^', '');
			caller = caller + '^';
		}
		if (object) {
			const type = typeof (object);
			if (type === 'boolean') {
				console.group(`%c${className}%c${caller}%c ${message} %c${object.valueOf()}`, blackBkg, blueBkg, big, greenBkg);
				console.groupEnd();
			} else if (type === 'bigint' || type === 'number' || type === 'string') {
				console.group(`%c${className}%c${caller}%c ${message} %c${object}`, blackBkg, blueBkg, big, greenBkg);
				console.groupEnd();
			} else {
				console.group(`%c${className}%c${caller}%c ${message}`, blackBkg, blueBkg, big);
				console.log(object);
				console.groupEnd();
			}
		} else if (object === false) {
			console.group(`%c${className}%c${caller}%c ${message} %c${object.valueOf()}`, blackBkg, blueBkg, big, greenBkg);
			console.groupEnd();
		} else {
			console.group(`%c${className}%c${caller}%c ${message}`, blackBkg, blueBkg, big);
			console.groupEnd();
		}
	}
}
