"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResolveError = exports.ValidationError = exports.RegistrationCompleteError = exports.DisposedError = exports.DejectedError = exports.formatErrors = void 0;
const validation_1 = require("./validation/validation");
const formatErrors = (errors) => {
    var _a;
    const es = (_a = errors === null || errors === void 0 ? void 0 : errors.filter(validation_1.errorFilter)) !== null && _a !== void 0 ? _a : [];
    const formatted = es
        .map(e => `${e.registrationToken}:\n${e.messages.join("\n")}`)
        .join("\n");
    return `Container has ${es.length} errors\n${formatted}`;
};
exports.formatErrors = formatErrors;
class DejectedError extends Error {
}
exports.DejectedError = DejectedError;
// tslint:disable-next-line:max-classes-per-file
class DisposedError extends DejectedError {
    constructor() {
        super(`Container is disposed and can no longer be used.`);
    }
}
exports.DisposedError = DisposedError;
// tslint:disable-next-line:max-classes-per-file
class RegistrationCompleteError extends DejectedError {
    constructor(token) {
        super(`Registration for token ${token} is complete. This registrar can no longer be used.`);
    }
}
exports.RegistrationCompleteError = RegistrationCompleteError;
// tslint:disable-next-line:max-classes-per-file
class ValidationError extends DejectedError {
    constructor(error) {
        super((0, exports.formatErrors)(error));
    }
}
exports.ValidationError = ValidationError;
// tslint:disable-next-line:max-classes-per-file
class ResolveError extends DejectedError {
    constructor(message) {
        super(message);
    }
    static create(token, type) {
        switch (type) {
            case "NoToken":
                return new ResolveError(`Container trying to resolve token <${token}> but it is not registered`);
            case "Circular":
                return new ResolveError(`Container found circular reference resolving token <${token}>`);
            case "Creation":
                return new ResolveError(`Failed to create item for <${token}>`);
        }
    }
}
exports.ResolveError = ResolveError;
