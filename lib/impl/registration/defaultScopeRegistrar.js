"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultScopeRegistrar = void 0;
const classTypeRegistrar_1 = require("./classTypeRegistrar");
const factoryTypeRegistrar_1 = require("./factoryTypeRegistrar");
class DefaultScopeRegistrar {
    constructor(parent, lifetimeScope) {
        this.parent = parent;
        this.lifetimeScope = lifetimeScope;
    }
    registerClass(token, clazz) {
        return this._setCurrentRegistrar(new classTypeRegistrar_1.ClassTypeRegistrar(this.parent, token, clazz));
    }
    registerFactory(token, factory) {
        return this._setCurrentRegistrar(new factoryTypeRegistrar_1.FactoryTypeRegistrar(this.parent, token, factory));
    }
    registerInstance(token, instance) {
        return this._setInstance(token, instance);
    }
    registerValue(token, value) {
        return this._setValue(token, value);
    }
    _setCurrentRegistrar(typeRegistrar) {
        this.setCurrentRegistrationToScope();
        this.currentType = typeRegistrar;
        return this.currentType;
    }
    _setValue(token, value) {
        this.setCurrentRegistrationToScope();
        this.lifetimeScope.register({
            type: "Value",
            valueType: typeof value,
            registrationToken: token,
            value
        });
        return this.parent;
    }
    _setInstance(token, value) {
        this.setCurrentRegistrationToScope();
        this.lifetimeScope.register({
            type: "Instance",
            registrationToken: token,
            value
        });
        return this.parent;
    }
    setCurrentRegistrationToScope() {
        if (this.currentType) {
            this.lifetimeScope.register(this.currentType.toRegistration());
            this.currentType = null;
        }
    }
}
exports.DefaultScopeRegistrar = DefaultScopeRegistrar;
