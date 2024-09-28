import { parse } from 'valibot';
import type { GenericSchema, InferOutput } from 'valibot';
import { parseEnv as _parseEnv } from './core';
import { mapObject } from './map-object';

type Schema = Record<string, GenericSchema>;

type WrappedValibotSchema<TSchema extends Schema> = {
	[K in keyof TSchema]: (value: unknown) => InferOutput<TSchema[K]>;
};

export function parseEnv<TSchema extends Schema>(schema: TSchema) {
	const wrappedSchema: WrappedValibotSchema<TSchema> = mapObject(
		schema,
		wrapValibotSchema,
	);

	return _parseEnv(wrappedSchema);
}

function wrapValibotSchema(schema: GenericSchema) {
	return (value: unknown) => {
		return parse(schema, value);
	};
}
