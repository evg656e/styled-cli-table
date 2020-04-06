const hasOwnProperty = Object.prototype.hasOwnProperty;

export function has(obj: any, key: PropertyKey) {
    return hasOwnProperty.call(obj, key);
}
