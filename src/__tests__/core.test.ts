import { afterEach, describe, expect, expectTypeOf, it } from 'vitest';
import { parseEnv, resetEnv, setEnv } from '../core';

describe('Envist Core', () => {
	afterEach(() => {
		resetEnv();
	});

	it('should parse env using parsing functions', () => {
		// Arrange.
		setEnv({
			number: 123,
			string: 'test',
		});

		// Act.
		const env = parseEnv({
			number: parseNumber,
			string: parseString,
		});

		// Assert.
		expect(env.number).toBe(123);
		expect(env.string).toBe('test');

		expectTypeOf(env).toEqualTypeOf<{
			number: number;
			string: string;
		}>();
	});

	it('should return an iterable env object', () => {
		// Arrange.
		setEnv({
			number: 123,
			string: 'test',
		});

		// Act.
		const env = parseEnv({
			number: parseNumber,
			string: parseString,
		});

		// Assert.
		expect(Object.keys(env)).toEqual(['number', 'string']);
	});

	it('should run the parsing only upon key access', () => {
		// Arrange.
		setEnv({
			number: 'not-a-number',
		});

		// Act.
		const env = parseEnv({
			number: parseNumber,
		});

		// Assert.
		expect(() => env.number).toThrow(
			"Can't parse environment variable `number`",
		);
	});

	it("should throw when a key doesn't exist in the env", () => {
		// Arrange.
		setEnv({
			a: 'test',
		});

		const env = parseEnv({
			a: parseString,
			b: parseNumber,
		});

		// Act & Assert.
		expect(() => env.b).toThrow('Missing environment variable `b`');
	});

	it("should throw when trying to access a key that doesn't have a parser set", () => {
		// Arrange.
		setEnv({
			a: 'test',
			b: 123,
		});

		const env = parseEnv({
			a: parseString,
		});

		// Act & Assert.
		expect(() => {
			return env['b' as 'a']; // Simulate runtime error.
		}).toThrow('No parser was set for `b`');
	});
});

function parseNumber(value: unknown): number {
	if (typeof value !== 'number') {
		throw new Error('value is not a number');
	}

	return value;
}

function parseString(value: unknown): string {
	if (typeof value !== 'string') {
		throw new Error('value is not a string');
	}

	return value;
}
