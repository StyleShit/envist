type Env = Record<string, unknown>;

type Schema = Record<string, (value: unknown) => any>;

type SchemaToEnv<TSchema extends Schema> = {
	[K in keyof TSchema]: ReturnType<TSchema[K]>;
};

type Prettify<T> = {
	[K in keyof T]: T[K];
} & {};

let env: Env = {};

export function setEnv(newEnv: Env) {
	env = newEnv;
}

export function resetEnv() {
	env = {};
}

export function parseEnv<TSchema extends Schema>(
	schema: TSchema,
): Prettify<SchemaToEnv<TSchema>> {
	const parsedEnv: Record<string, unknown> = {};

	Object.entries(schema).forEach(([key, parser]) => {
		if (!(key in env)) {
			throw new Error(`Missing environment variable \`${key}\``);
		}

		parsedEnv[key] = parser(env[key]);
	});

	return parsedEnv as SchemaToEnv<TSchema>;
}
