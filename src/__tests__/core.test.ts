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
		expect(env).toStrictEqual({
			number: 123,
			string: 'test',
		});

		expectTypeOf(env).toEqualTypeOf<{
			number: number;
			string: string;
		}>();
	});

	it("should throw when a key doesn't exist in the env", () => {
		// Arrange.
		setEnv({
			a: 'test',
		});

		// Act & Assert.
		expect(() =>
			parseEnv({
				a: parseString,
				b: parseNumber,
			}),
		).toThrow('Missing environment variable `b`');
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
