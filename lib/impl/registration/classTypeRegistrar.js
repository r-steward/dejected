"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassTypeRegistrar = void 0;
const validation_1 = require("../validation/validation");
const baseTypeRegistrar_1 = require("./baseTypeRegistrar");
class ClassTypeRegistrar extends baseTypeRegistrar_1.BaseTypeRegistrar {
    constructor(parent, registrationToken, clazz) {
        super(parent, registrationToken);
        this.clazz = clazz;
    }
    toRegistration() {
        const { scope, injections, clazz, registrationToken } = this;
        return {
            type: "Class",
            registrationToken,
            scope,
            injections,
            create: (args) => new clazz(...args)
        };
    }
    validate() {
        return (0, validation_1.errorFromMessages)(this.registrationToken, super.checkArgLength(this.clazz.length), super.checkInjectAfterDefault());
    }
}
exports.ClassTypeRegistrar = ClassTypeRegistrar;
