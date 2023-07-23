"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDisposable = void 0;
const isDisposable = (obj) => {
    const disposeFunction = obj === null || obj === void 0 ? void 0 : obj.dispose;
    return typeof disposeFunction === "function" && disposeFunction.length === 0;
};
exports.isDisposable = isDisposable;
