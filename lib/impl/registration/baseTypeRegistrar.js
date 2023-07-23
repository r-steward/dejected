"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseTypeRegistrar = void 0;
const errors_1 = require("../errors");
class BaseTypeRegistrar {
    constructor(parent, registrationToken) {
        this.parent = parent;
        this.registrationToken = registrationToken;
        this._injections = [];
        this._defaultArgCount = 0;
        this._scope = "singleton";
        this._errors = [];
    }
    get scope() {
        return this._scope;
    }
    get injections() {
        return this._injections;
    }
    inject(token) {
        this.checkNotCompleted();
        if (this._defaultArgCount > 0) {
            this.injectAfterDefault = true;
        }
        this._injections.push({ token });
        return this;
    }
    injectValue(value) {
        this.checkNotCompleted();
        if (this._defaultArgCount > 0) {
            this.injectAfterDefault = true;
        }
        this._injections.push({ value });
        return this;
    }
    defaultArg() {
        this.checkNotCompleted();
        this._defaultArgCount++;
        return this;
    }
    asSingleton() {
        return this.withScope("singleton");
    }
    asTransient() {
        return this.withScope("transient");
    }
    withScope(scope) {
        this.checkNotCompleted();
        this._scope = scope;
        return this.parent;
    }
    complete() {
        this.isComplete = true;
    }
    checkNotCompleted() {
        if (this.isComplete) {
            throw new errors_1.RegistrationCompleteError(this.registrationToken);
        }
    }
    checkInjectAfterDefault() {
        return this.injectAfterDefault
            ? `Attempted to inject resolved arguments after a default argument`
            : null;
    }
    checkArgLength(expected) {
        const tokens = this.injections.length;
        const defaultArgs = this._defaultArgCount;
        const expectedArgCount = tokens + defaultArgs;
        return expectedArgCount !== expected
            ? `Expected ${expected} total injections but got ${expectedArgCount} (${tokens} resolved${defaultArgs > 0 ? `and ${defaultArgs} default arguments` : ""})`
            : null;
    }
}
exports.BaseTypeRegistrar = BaseTypeRegistrar;
