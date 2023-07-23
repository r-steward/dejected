type GetChildren<T, N> = (node: N) => ReadonlyArray<T> | null | undefined;
export declare const checkChildrenExistInMap: <T, N>(entries: Map<T, N>, getter: GetChildren<T, N>) => Set<T>;
export {};
