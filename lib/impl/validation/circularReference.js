"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCircular = void 0;
const checkCircular = (entries, getter) => {
    const getChildren = _createGetChildren(entries, getter);
    const context = _createContext(getChildren);
    entries.forEach((_, k) => {
        _findDeviantChildren(k, context);
    });
    return context.circularRefs;
};
exports.checkCircular = checkCircular;
const _createGetChildren = (entries, getter) => (k) => (entries.has(k) ? getter(entries.get(k)) : null);
const _createContext = (getter) => ({
    getter,
    circularRefs: new Map(),
    currentRoute: new Set(),
    currentRouteOrder: []
});
const _newRouteContext = (thisToken, context) => {
    const route = [thisToken];
    return {
        getter: context.getter,
        circularRefs: context.circularRefs,
        currentRouteOrder: route,
        currentRoute: new Set(route)
    };
};
const _appendRouteContext = (thisToken, context) => {
    const route = [...context.currentRouteOrder, thisToken];
    return {
        getter: context.getter,
        circularRefs: context.circularRefs,
        currentRouteOrder: route,
        currentRoute: new Set(route)
    };
};
const _appendCircular = (ancestorToken, context) => {
    let circularRef = context.circularRefs.get(ancestorToken);
    if (!circularRef) {
        circularRef = { ancestorToken, deviantRoutes: [] };
        context.circularRefs.set(ancestorToken, circularRef);
    }
    circularRef.deviantRoutes.push(context.currentRouteOrder);
};
const _findDeviantChildren = (thisToken, context) => {
    // don't search ancestors that are already processed
    if (context.circularRefs.has(thisToken)) {
        return;
    }
    // for each child find this token, and then search them for deviant children
    const children = context.getter(thisToken);
    if (children) {
        const childContext = _newRouteContext(thisToken, context);
        children.forEach(child => _findAncestorToken(thisToken, child, childContext));
        children.forEach(child => _findDeviantChildren(child, childContext));
    }
};
const _findAncestorToken = (ancestorToken, thisToken, searchContext) => {
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
            }
            else {
                _findAncestorToken(ancestorToken, child, newContext);
            }
        });
    }
};
