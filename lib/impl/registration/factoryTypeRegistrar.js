"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FactoryTypeRegistrar = void 0;
const validation_1 = require("../validation/validation");
const baseTypeRegistrar_1 = require("./baseTypeRegistrar");
class FactoryTypeRegistrar extends baseTypeRegistrar_1.BaseTypeRegistrar {
    constructor(parent, registrationToken, factory) {
        super(parent, registrationToken);
        this.factory = factory;
    }
    toRegistration() {
        const { scope, injections, factory, registrationToken } = this;
        return {
            type: "Factory",
            registrationToken,
            scope,
            injections,
            create: (args) => factory(...args)
        };
    }
    validate() {
        return (0, validation_1.errorFromMessages)(this.registrationToken, super.checkArgLength(this.factory.length - 1), super.checkInjectAfterDefault());
    }
}
exports.FactoryTypeRegistrar = FactoryTypeRegistrar;
