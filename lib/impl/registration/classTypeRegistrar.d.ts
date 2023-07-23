import { Class } from "../../types/container";
import { ContainerRegistration } from "../scope/lifetimeScopeRegistration";
import { ContainerError } from "../validation/validation";
import { BaseTypeRegistrar } from "./baseTypeRegistrar";
export declare class ClassTypeRegistrar<T, TParent> extends BaseTypeRegistrar<T, TParent> {
    private readonly clazz;
    constructor(parent: TParent, registrationToken: string, clazz: Class<T>);
    toRegistration(): ContainerRegistration<T>;
    validate(): ContainerError;
}
