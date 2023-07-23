"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkChildrenExistInMap = void 0;
const checkChildrenExistInMap = (entries, getter) => {
    const notRegistered = new Set();
    entries.forEach((n, t) => {
        var _a;
        (_a = getter(n)) === null || _a === void 0 ? void 0 : _a.forEach(child => {
            if (!entries.has(child)) {
                notRegistered.add(child);
            }
        });
    });
    return notRegistered;
};
exports.checkChildrenExistInMap = checkChildrenExistInMap;
