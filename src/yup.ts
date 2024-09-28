import type { Schema as YupSchema, InferType } from 'yup';
import { parseEnv as _parseEnv } from './core';
import { mapObject } from './map-object';

type Schema = Record<string, YupSchema>;

type WrappedYupSchema<TSchema extends Schema> = {
	[K in keyof TSchema]: (value: unknown) => InferType<TSchema[K]>;
};

export function parseEnv<TSchema extends Schema>(schema: TSchema) {
	const wrappedSchema: WrappedYupSchema<TSchema> = mapObject(
		schema,
		wrapYupSchema,
	);

	return _parseEnv(wrappedSchema);
}

function wrapYupSchema(schema: YupSchema) {
	return (value: unknown) => {
		return schema.validateSync(value);
	};
}
