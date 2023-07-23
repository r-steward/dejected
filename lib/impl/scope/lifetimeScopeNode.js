"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LifetimeScopeNode = void 0;
const errors_1 = require("../errors");
const injection_1 = require("../injection");
const lifetimeScope_1 = require("./lifetimeScope");
const lifetimeScopeRegistration_1 = require("./lifetimeScopeRegistration");
class LifetimeScopeNode {
    constructor(parentScope) {
        this.parentScope = parentScope;
        this.registrations = new Map();
        this.scopeTransients = [];
        this.scopeSingletons = new Map();
    }
    get isDisposed() {
        return this._isDisposed;
    }
    register(registration) {
        this._checkDisposed();
        this.registrations.set(registration.registrationToken, registration);
        return this;
    }
    resolveAtLifetime(token) {
        this._checkDisposed();
        const context = {
            headScope: this,
            resolutionRoute: new Set([token]),
            resolvedTransientItems: []
        };
        const resolved = this.resolveWithContext(token, context);
        this.scopeTransients.push(...context.resolvedTransientItems);
        return resolved;
    }
    resolveWithContext(token, context) {
        this._checkDisposed();
        const scopedRegistration = this.registrations.get(token);
        if (scopedRegistration) {
            if ((0, lifetimeScopeRegistration_1.isTypeRegistration)(scopedRegistration)) {
                return this.resolveLocalType(scopedRegistration, context);
            }
            else {
                return scopedRegistration.value;
            }
        }
        else {
            if (this.parentScope == null) {
                throw errors_1.ResolveError.create(token, "NoToken");
            }
            return this.parentScope.resolveWithContext(token, context);
        }
    }
    dispose() {
        if (!this.isDisposed) {
            this._isDisposed = true;
            // dispose singletons
            this.scopeSingletons.forEach(s => {
                if ((0, lifetimeScope_1.isDisposable)(s)) {
                    s.dispose();
                }
            });
            // dispose transients
            this.scopeTransients.forEach(t => t.dispose());
        }
    }
    resolveLocalType(r, context) {
        let resolvedItem = null;
        let resolveContext = context;
        // if resolution has singleton parent, only resolve from this scope or above
        const isSingleton = (0, lifetimeScopeRegistration_1.isSingletonRegistration)(r);
        if (isSingleton) {
            // look up item
            resolvedItem = this._getLocalScopeSingleton(r.registrationToken);
            if (!resolvedItem) {
                resolveContext = this._setAsHeadScope(context);
            }
        }
        if (!resolvedItem) {
            const args = this._resolveArgs(r, resolveContext);
            resolvedItem = this._createItem(r, args);
            if (isSingleton) {
                // if it's a singleton, it should be saved on this scope
                this._saveLocalScopeSingleton(r.registrationToken, resolvedItem);
            }
            else {
                // it it's a transient, it should be saved to the context
                this._pushDisposableTransientToContext(resolvedItem, context);
            }
        }
        return resolvedItem;
    }
    _resolveArgs(registration, context) {
        return registration.injections.map(i => {
            if ((0, injection_1.isTokenInjection)(i)) {
                const childToken = i.token;
                const currentRoute = context.resolutionRoute;
                if (currentRoute.has(childToken)) {
                    throw errors_1.ResolveError.create(registration.registrationToken, "Circular");
                }
                return context.headScope.resolveWithContext(childToken, Object.assign(Object.assign({}, context), { resolutionRoute: new Set([...currentRoute, childToken]) }));
            }
            return i.value;
        });
    }
    _createItem(registration, args) {
        try {
            return registration.create(args);
        }
        catch (e) {
            throw errors_1.ResolveError.create(registration === null || registration === void 0 ? void 0 : registration.registrationToken, "Creation");
        }
    }
    _getLocalScopeSingleton(token) {
        return this.scopeSingletons.get(token);
    }
    _saveLocalScopeSingleton(token, singletonValue) {
        return this.scopeSingletons.set(token, singletonValue);
    }
    _pushDisposableTransientToContext(resolvedItem, context) {
        if ((0, lifetimeScope_1.isDisposable)(resolvedItem)) {
            context.resolvedTransientItems.push(resolvedItem);
        }
    }
    _checkDisposed() {
        if (this.isDisposed) {
            throw new errors_1.DisposedError();
        }
    }
    _setAsHeadScope(context) {
        return Object.assign(Object.assign({}, context), { headScope: this });
    }
}
exports.LifetimeScopeNode = LifetimeScopeNode;
