import type { TypeOf, ZodType } from 'zod';
import { parseEnv as _parseEnv } from './core';
import { mapObject } from './map-object';

type Schema = Record<string, ZodType>;

type WrappedZodSchema<TSchema extends Schema> = {
	[K in keyof TSchema]: (value: unknown) => TypeOf<TSchema[K]>;
};

export function parseEnv<TSchema extends Schema>(schema: TSchema) {
	const wrappedSchema: WrappedZodSchema<TSchema> = mapObject(
		schema,
		wrapZodSchema,
	);

	return _parseEnv(wrappedSchema);
}

function wrapZodSchema(schema: ZodType) {
	return (value: unknown) => {
		return schema.parse(value);
	};
}
