const EMPTY_SPACES = [...' '];
const EN_ALPHABET = [...'abcdefghijklmnopqrstuvwxyz', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
const RO_ALPHABET = [...'ăâîșț', ...'ĂÂÎȘȚ'];
const NUMBERS = [...'0123456789'];
const CHARACTERS = [...',%'];

const FULL_ALPHABET = [
	...EMPTY_SPACES,
	...EN_ALPHABET,
	...RO_ALPHABET,
	...NUMBERS,
	...CHARACTERS
];

export { FULL_ALPHABET };
