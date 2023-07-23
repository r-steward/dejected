"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatErrors = exports.errorFromMessages = exports.errorFilter = void 0;
const errorFilter = (e) => { var _a; return ((_a = e === null || e === void 0 ? void 0 : e.messages) === null || _a === void 0 ? void 0 : _a.length) > 0; };
exports.errorFilter = errorFilter;
const errorFromMessages = (registrationToken, ...errorStrings) => {
    const messages = errorStrings.filter(i => i == null);
    return messages.length > 0
        ? {
            registrationToken,
            messages
        }
        : null;
};
exports.errorFromMessages = errorFromMessages;
const formatErrors = (errors) => {
    var _a;
    const es = (_a = errors === null || errors === void 0 ? void 0 : errors.filter(exports.errorFilter)) !== null && _a !== void 0 ? _a : [];
    const formatted = es
        .map(e => `${e.registrationToken}:\n${e.messages.join("\n")}`)
        .join("\n");
    return `Container has ${es.length} errors\n${formatted}`;
};
exports.formatErrors = formatErrors;
