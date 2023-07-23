import { Disposable } from "../../types/disposable";
import { ContainerRegistration } from "./lifetimeScopeRegistration";
export interface LifetimeScope extends Disposable {
    resolveAtLifetime<T>(token: string): T;
}
export interface MutableLifetimeScope extends LifetimeScope {
    isDisposed: boolean;
    register<T>(registration: ContainerRegistration<T>): this;
}
export interface TraversableLifetimeScope {
    resolveWithContext<T>(token: string, context: ResolutionContext): T;
}
export type LifetimeInstance<T = unknown> = {
    readonly registrationToken: string;
    readonly disposables?: Disposable[];
    readonly singletonValue?: T;
};
export interface ResolutionContext {
    readonly headScope: TraversableLifetimeScope;
    readonly resolvedTransientItems: Disposable[];
    readonly resolutionRoute: Set<string>;
}
export declare const isDisposable: (obj: any) => obj is Disposable;
