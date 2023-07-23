import { ScopeRegistrar } from "../impl/registration/scopeRegistrar";
import { Disposable } from "./disposable";
export type Class<T> = new (...args: any) => T;
export type Instance<T extends object> = T;
export type Value = number | string | undefined;
export type Factory<T> = (...args: any) => T;
export type Scope = "singleton" | "transient";
export interface ResolveContainer {
    resolve<T>(token: string): T;
}
export interface ReadContainer extends ResolveContainer {
    createChild(): Container;
    validate(): void;
}
export interface Container extends ReadContainer, Disposable, ScopeRegistrar<Container> {
}
