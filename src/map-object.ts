export function mapObject<TObject extends Record<string, any>, TMappedValue>(
	object: TObject,
	mapper: (value: TObject[keyof TObject], key: keyof TObject) => TMappedValue,
): Record<keyof TObject, TMappedValue> {
	const entries = Object.entries(object).map(([key, value]) => {
		return [key, mapper(value as never, key as never)];
	});

	return Object.fromEntries(entries) as never;
}
