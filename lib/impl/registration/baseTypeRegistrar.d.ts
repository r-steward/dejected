import { Scope, Value } from "../../types/container";
import { Injection } from "../injection";
import { ContainerRegistration } from "../scope/lifetimeScopeRegistration";
import { OwnedTypeRegistrar, TypeRegistrar } from "./scopeRegistrar";
export declare abstract class BaseTypeRegistrar<T, TParent> implements OwnedTypeRegistrar<T>, TypeRegistrar<TParent> {
    protected readonly parent: TParent;
    readonly registrationToken: string;
    protected isComplete: boolean;
    protected readonly _injections: Injection[];
    protected _defaultArgCount: number;
    protected _scope: Scope;
    protected readonly _errors: string[];
    protected injectAfterDefault: boolean;
    constructor(parent: TParent, registrationToken: string);
    get scope(): Scope;
    get injections(): Injection[];
    inject(token: string): this;
    injectValue(value: Value): this;
    defaultArg(): this;
    asSingleton(): TParent;
    asTransient(): TParent;
    withScope(scope: Scope): TParent;
    complete(): void;
    protected checkNotCompleted(): void;
    abstract toRegistration(): ContainerRegistration<T>;
    checkInjectAfterDefault(): string;
    checkArgLength(expected: number): string;
}
