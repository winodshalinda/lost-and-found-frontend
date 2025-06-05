interface DebouncedFunction<F extends (...args: any[]) => any> {
    (...args: Parameters<F>): void;
    cancel: () => void;
}

export const debounceWithCancel = <F extends (...args: any[]) => any>(func: F, delay: number): DebouncedFunction<F> => {
    let timeoutId: NodeJS.Timeout | undefined;

    const debouncedFunc = (...args: Parameters<F>): void => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func(...args);
        }, delay);
    };

    debouncedFunc.cancel = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = undefined;
        }
    };

    return debouncedFunc;
};