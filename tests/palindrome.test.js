/* eslint-disable linebreak-style */
// eslint-disable-next-line linebreak-style
/* eslint-disable no-undef */
/* eslint-disable linebreak-style */
const palindrome = require('../utils/for_testing').palindrome

test('palindrome of a', () => {
	const result = palindrome('a')

	expect(result).toBe('a')
})

test('palindrome of react', () => {
	const result = palindrome('react')

	expect(result).toBe('tcaer')
})

test('palindrome of releveler', () => {
	const result = palindrome('releveler')

	expect(result).toBe('releveler')
})