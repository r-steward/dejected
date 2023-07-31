import { Class, Factory, Instance, Scope, Value } from "../../types/container";
import { ContainerRegistration } from "../scope/lifetimeScopeRegistration";
import { RegistrationValidationMessages } from "../validation/validation";
export interface TypeRegistrar<TParent> {
    inject(token: string): this;
    injectValue(value: Value): this;
    defaultArg(): this;
    withScope(scope: Scope): TParent;
    asSingleton(): TParent;
    asTransient(): TParent;
}
export interface OwnedTypeRegistrar<T> {
    validate(): RegistrationValidationMessages;
    complete(): void;
    toRegistration(): ContainerRegistration<T>;
}
export interface ScopeTypeRegistrar<T, TParent> extends TypeRegistrar<TParent>, OwnedTypeRegistrar<T> {
}
export interface ScopeRegistrar<TParent> {
    registerClass<T>(token: string, clazz: Class<T>): TypeRegistrar<TParent>;
    registerFactory<T>(token: string, factory: Factory<T>): TypeRegistrar<TParent>;
    registerInstance<T extends object>(token: string, instance: Instance<T>): TParent;
    registerValue(token: string, value: Value): TParent;
}
