import { Factory } from "../../types/container";
import { ContainerRegistration } from "../scope/lifetimeScopeRegistration";
import { RegistrationValidationMessages } from "../validation/validation";
import { BaseTypeRegistrar } from "./baseTypeRegistrar";
export declare class FactoryTypeRegistrar<T, TParent> extends BaseTypeRegistrar<T, TParent> {
    private readonly factory;
    constructor(parent: TParent, registrationToken: string, factory: Factory<T>);
    toRegistration(): ContainerRegistration<T>;
    validate(): RegistrationValidationMessages;
}
