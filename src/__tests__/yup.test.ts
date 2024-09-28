import { afterEach, describe, expect, expectTypeOf, it } from 'vitest';
import { resetEnv, setEnv } from '../core';
import { parseEnv } from '../yup';
import { string, number } from 'yup';

describe('Envist Yup', () => {
	afterEach(() => {
		resetEnv();
	});

	it('should parse env using yup schemas', () => {
		// Arrange.
		setEnv({
			number: 123,
			string: 'test',
		});

		// Act.
		const env = parseEnv({
			number: number().required(),
			string: string().required(),
		});

		// Assert.
		expect(env.number).toBe(123);
		expect(env.string).toBe('test');

		expect(Object.keys(env)).toEqual(['number', 'string']);

		expectTypeOf(env).toEqualTypeOf<{
			number: number;
			string: string;
		}>();
	});

	it('should throw when value is invalid', () => {
		// Arrange.
		setEnv({
			number: 'not-a-number',
		});

		// Act.
		const env = parseEnv({
			number: number().required(),
		});

		// Assert.
		expect(() => env.number).toThrow(
			"Can't parse environment variable `number`",
		);
	});
});
