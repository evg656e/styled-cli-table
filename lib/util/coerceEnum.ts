export function coerceEnum<E extends Record<keyof E, number | string> & { [k: number]: string }>(Enum: E) {
    return function (value?: string | number) {
        return (typeof value === 'number' ?
            value : value !== undefined ?
                Enum[value.toLocaleLowerCase() as keyof E] ?? 0 : 0);
    };
}
