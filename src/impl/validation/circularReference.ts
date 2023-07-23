type GetChildren<T> = (k: T) => ReadonlyArray<T>;

type CircularReferenceContext<T> = {
  getter: GetChildren<T>;
  currentRoute: Set<T>;
  currentRouteOrder: T[];
  circularRefs: Map<T, DeviantRoutes<T>>;
};

type DeviantRoutes<T> = {
  ancestorToken: T;
  deviantRoutes: ReadonlyArray<T>[];
};

export const checkCircular = <T, N>(
  entries: Map<T, N>,
  getter: (node: N) => ReadonlyArray<T> | null | undefined
) => {
  const getChildren = _createGetChildren(entries, getter);
  const context = _createContext(getChildren);
  entries.forEach((_, k) => {
    _findDeviantChildren(k, context);
  });
  return context.circularRefs;
};

const _createGetChildren = <T, N>(
  entries: Map<T, N>,
  getter: (node: N) => ReadonlyArray<T>
) => (k: T) => (entries.has(k) ? getter(entries.get(k)) : null);

const _createContext = <T>(
  getter: GetChildren<T>
): CircularReferenceContext<T> => ({
  getter,
  circularRefs: new Map(),
  currentRoute: new Set(),
  currentRouteOrder: []
});

const _newRouteContext = <T>(
  thisToken: T,
  context: CircularReferenceContext<T>
): CircularReferenceContext<T> => {
  const route = [thisToken];
  return {
    getter: context.getter,
    circularRefs: context.circularRefs,
    currentRouteOrder: route,
    currentRoute: new Set(route)
  };
};

const _appendRouteContext = <T>(
  thisToken: T,
  context: CircularReferenceContext<T>
): CircularReferenceContext<T> => {
  const route = [...context.currentRouteOrder, thisToken];
  return {
    getter: context.getter,
    circularRefs: context.circularRefs,
    currentRouteOrder: route,
    currentRoute: new Set(route)
  };
};

const _appendCircular = <T>(
  ancestorToken: T,
  context: CircularReferenceContext<T>
) => {
  let circularRef = context.circularRefs.get(ancestorToken);
  if (!circularRef) {
    circularRef = { ancestorToken, deviantRoutes: [] };
    context.circularRefs.set(ancestorToken, circularRef);
  }
  circularRef.deviantRoutes.push(context.currentRouteOrder);
};

const _findDeviantChildren = <T>(
  thisToken: T,
  context: CircularReferenceContext<T>
): void => {
  // don't search ancestors that are already processed
  if (context.circularRefs.has(thisToken)) {
    return;
  }
  // for each child find this token, and then search them for deviant children
  const children = context.getter(thisToken);
  if (children) {
    const childContext = _newRouteContext(thisToken, context);
    children.forEach(child =>
      _findAncestorToken(thisToken, child, childContext)
    );
    children.forEach(child => _findDeviantChildren(child, childContext));
  }
};

const _findAncestorToken = <T>(
  ancestorToken: T,
  thisToken: T,
  searchContext: CircularReferenceContext<T>
): void => {
  // if we've seen this token before we have to stop recursion
  if (searchContext.currentRoute.has(thisToken)) {
    return;
  }
  // find ancestor token in children
  const children = searchContext.getter(thisToken);
  if (children) {
    const newContext = _appendRouteContext(thisToken, searchContext);
    children.forEach(child => {
      if (child === ancestorToken) {
        _appendCircular(ancestorToken, newContext);
      } else {
        _findAncestorToken(ancestorToken, child, newContext);
      }
    });
  }
};
