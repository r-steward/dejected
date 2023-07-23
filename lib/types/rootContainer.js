"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newContainer = void 0;
const iocContainer_1 = require("../impl/container/iocContainer");
const newContainer = () => iocContainer_1.IocContainer.createRootContainer();
exports.newContainer = newContainer;
