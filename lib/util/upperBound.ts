export function upperBound<T>(array: ArrayLike<T>, value: T, comparefn: (lhs: T, rhs: T) => number, first = 0, last = array.length, thisArg?: any) {
    let count = last - first;

    while (count > 0) {	// divide and conquer, find half that contains answer
        const count2 = count / 2 | 0;
        let mid = first + count2;

        if (comparefn.call(thisArg, value, array[mid]) >= 0) { // try top half
            first = ++mid;
            count -= count2 + 1;
        }
        else
            count = count2;
    }

    return first;
}
