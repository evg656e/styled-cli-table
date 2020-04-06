export function bound(min: number, value: number, max: number) {
    return Math.max(min, Math.min(value, max));
}
