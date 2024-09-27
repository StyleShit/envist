type Env = Record<string, unknown>;

type Schema = Record<string, Parser>;

type Parser = (value: unknown) => any;

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
	return new Proxy({} as Record<string, unknown>, {
		get(target, key) {
			if (typeof key === 'symbol') {
				throw new Error('Symbol keys are not supported');
			}

			if (key in target) {
				return target[key];
			}

			if (!(key in env)) {
				throw new Error(`Missing environment variable \`${key}\``);
			}

			const parser = schema[key];

			if (!parser) {
				throw new Error(`No parser was set for \`${key}\``);
			}

			try {
				target[key] = parser(env[key]);
			} catch {
				throw new Error(`Can't parse environment variable \`${key}\``);
			}

			return target[key];
		},

		ownKeys() {
			return Reflect.ownKeys(schema);
		},

		getOwnPropertyDescriptor() {
			return {
				configurable: true,
				enumerable: true,
			};
		},
	}) as SchemaToEnv<TSchema>;
}
