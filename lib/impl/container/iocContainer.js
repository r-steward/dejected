"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IocContainer = void 0;
const defaultScopeRegistrar_1 = require("../registration/defaultScopeRegistrar");
const lifetimeScopeNode_1 = require("../scope/lifetimeScopeNode");
class IocContainer {
    static createRootContainer() {
        return new IocContainer(null, new lifetimeScopeNode_1.LifetimeScopeNode(null));
    }
    constructor(parentContainer, lifetimeScope) {
        this.parentContainer = parentContainer;
        this.lifetimeScope = lifetimeScope;
        this.children = new Set();
        this.scopeRegistrar = new defaultScopeRegistrar_1.DefaultScopeRegistrar(this, lifetimeScope);
    }
    resolve(token) {
        this.scopeRegistrar.setCurrentRegistrationToScope();
        return this.lifetimeScope.resolveAtLifetime(token);
    }
    dispose() {
        var _a;
        if (!this.isDisposed) {
            this.isDisposed = true;
            this.lifetimeScope.dispose();
            this.children.forEach(c => c.dispose());
            this.children.clear();
            (_a = this.parentContainer) === null || _a === void 0 ? void 0 : _a.onDispose(this);
        }
    }
    onDispose(child) {
        this.children.delete(child);
    }
    createChild() {
        this.scopeRegistrar.setCurrentRegistrationToScope();
        const child = new IocContainer(this, new lifetimeScopeNode_1.LifetimeScopeNode(this.lifetimeScope));
        this.children.add(child);
        return child;
    }
    validate() {
        throw new Error("Method not implemented.");
    }
    registerClass(token, clazz) {
        return this.scopeRegistrar.registerClass(token, clazz);
    }
    registerFactory(token, factory) {
        return this.scopeRegistrar.registerFactory(token, factory);
    }
    registerInstance(token, instance) {
        return this.scopeRegistrar.registerInstance(token, instance);
    }
    registerValue(token, value) {
        return this.scopeRegistrar.registerValue(token, value);
    }
}
exports.IocContainer = IocContainer;
