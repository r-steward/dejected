import { Class, Factory, Value } from "../../types/container";
import { MutableLifetimeScope } from "../scope/lifetimeScope";
import { ScopeRegistrar, TypeRegistrar } from "./scopeRegistrar";
export declare class DefaultScopeRegistrar<TParent> implements ScopeRegistrar<TParent> {
    private readonly parent;
    protected readonly lifetimeScope: MutableLifetimeScope;
    constructor(parent: TParent, lifetimeScope: MutableLifetimeScope);
    private currentType;
    registerClass<T>(token: string, clazz: Class<T>): TypeRegistrar<TParent>;
    registerFactory<T>(token: string, factory: Factory<T>): TypeRegistrar<TParent>;
    registerInstance<T extends object>(token: string, instance: T): TParent;
    registerValue(token: string, value: Value): TParent;
    private _setCurrentRegistrar;
    private _setValue;
    private _setInstance;
    setCurrentRegistrationToScope(): void;
}
