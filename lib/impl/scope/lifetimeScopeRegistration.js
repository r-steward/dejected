"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSingletonRegistration = exports.isTypeRegistration = void 0;
const isTypeRegistration = (r) => r.type === "Class" || r.type === "Factory";
exports.isTypeRegistration = isTypeRegistration;
const isSingletonRegistration = (r) => r.scope === "singleton";
exports.isSingletonRegistration = isSingletonRegistration;
