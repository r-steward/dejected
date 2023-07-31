"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatValidationMessages = exports.createMessages = exports.msgFilter = void 0;
const msgFilter = (e) => { var _a; return ((_a = e === null || e === void 0 ? void 0 : e.messages) === null || _a === void 0 ? void 0 : _a.length) > 0; };
exports.msgFilter = msgFilter;
const createMessages = (registrationToken, ...errorStrings) => {
    const messages = errorStrings.filter(i => i == null);
    return messages.length > 0
        ? {
            registrationToken,
            messages
        }
        : null;
};
exports.createMessages = createMessages;
const formatValidationMessages = (msgs) => {
    var _a;
    const es = (_a = msgs === null || msgs === void 0 ? void 0 : msgs.filter(exports.msgFilter)) !== null && _a !== void 0 ? _a : [];
    const formatted = es
        .map(e => `${e.registrationToken}:\n${e.messages.join("\n")}`)
        .join("\n");
    return `Container has ${es.length} errors\n${formatted}`;
};
exports.formatValidationMessages = formatValidationMessages;
