"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultScopeRegistrar = void 0;
const classTypeRegistrar_1 = require("./classTypeRegistrar");
const factoryTypeRegistrar_1 = require("./factoryTypeRegistrar");
class DefaultScopeRegistrar {
    constructor(parent, lifetimeScope) {
        this.parent = parent;
        this.lifetimeScope = lifetimeScope;
        this.validation = new Map();
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
    setCurrentRegistrationToScope() {
        if (this.currentType) {
            this.currentType.complete();
            this.addValidation(this.currentType.validate());
            this.lifetimeScope.register(this.currentType.toRegistration());
            this.currentType = null;
        }
    }
    addValidation(msg) {
        var _a;
        if (msg) {
            if (((_a = msg.messages) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                this.validation.set(msg.registrationToken, msg);
            }
            else {
                this.validation.delete(msg.registrationToken);
            }
        }
        return this;
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
}
exports.DefaultScopeRegistrar = DefaultScopeRegistrar;
