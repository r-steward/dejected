type DeviantRoutes<T> = {
    ancestorToken: T;
    deviantRoutes: ReadonlyArray<T>[];
};
export declare const checkCircular: <T, N>(entries: Map<T, N>, getter: (node: N) => readonly T[]) => Map<T, DeviantRoutes<T>>;
export {};
