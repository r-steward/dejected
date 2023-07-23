type GetChildren<T, N> = (node: N) => ReadonlyArray<T> | null | undefined;

export const checkChildrenExistInMap = <T, N>(
  entries: Map<T, N>,
  getter: GetChildren<T, N>
) => {
  const notRegistered: Set<T> = new Set();
  entries.forEach((n, t) => {
    getter(n)?.forEach(child => {
      if (!entries.has(child)) {
        notRegistered.add(child);
      }
    });
  });
  return notRegistered;
};
