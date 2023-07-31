import { MutableLifetimeScope, ResolutionContext, TraversableLifetimeScope } from "./lifetimeScope";
import { ContainerRegistration } from "./lifetimeScopeRegistration";
export declare class LifetimeScopeNode implements TraversableLifetimeScope, MutableLifetimeScope {
    private readonly parentScope;
    private _isDisposed;
    readonly id: string;
    private readonly registrations;
    private readonly scopeTransients;
    private readonly scopeSingletons;
    constructor(parentScope: TraversableLifetimeScope);
    get isDisposed(): boolean;
    register<T>(registration: ContainerRegistration<T>): this;
    resolveAtLifetime<T>(token: string): T;
    resolveWithContext<T>(token: string, context: ResolutionContext): T;
    dispose(): void;
    private resolveLocalType;
    private _resolveArgs;
    private _createItem;
    private _getLocalScopeSingleton;
    private _saveLocalScopeSingleton;
    private _pushDisposableTransientToContext;
    private _checkDisposed;
    private _setAsHeadScope;
}
