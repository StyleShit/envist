import { afterEach, describe, expect, expectTypeOf, it } from 'vitest';
import { resetEnv, setEnv } from '../core';
import { parseEnv } from '../zod';
import { z } from 'zod';

describe('Envist Zod', () => {
	afterEach(() => {
		resetEnv();
	});

	it('should parse env using zod schemas', () => {
		// Arrange.
		setEnv({
			number: 123,
			string: 'test',
		});

		// Act.
		const env = parseEnv({
			number: z.number(),
			string: z.string(),
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
			number: z.number(),
		});

		// Assert.
		expect(() => env.number).toThrow(
			"Can't parse environment variable `number`",
		);
	});
});
