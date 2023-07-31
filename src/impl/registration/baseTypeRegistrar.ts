import { Scope, Value } from "../../types/container";
import { RegistrationCompleteError } from "../errors";
import { Injection } from "../injection";
import { ContainerRegistration } from "../scope/lifetimeScopeRegistration";
import { RegistrationValidationMessages } from "../validation/validation";
import { OwnedTypeRegistrar, TypeRegistrar } from "./scopeRegistrar";

export abstract class BaseTypeRegistrar<T, TParent>
  implements OwnedTypeRegistrar<T>, TypeRegistrar<TParent> {
  protected isComplete: boolean;
  protected readonly _injections: Injection[] = [];
  protected _defaultArgCount = 0;
  protected _scope: Scope = "singleton";

  protected readonly _errors: string[] = [];
  protected injectAfterDefault: boolean;

  constructor(
    protected readonly parent: TParent,
    public readonly registrationToken: string
  ) {}

  public get scope() {
    return this._scope;
  }

  public get injections() {
    return this._injections;
  }

  inject(token: string): this {
    this.checkNotCompleted();
    if (this._defaultArgCount > 0) {
      this.injectAfterDefault = true;
    }
    this._injections.push({ token });
    return this;
  }

  injectValue(value: Value): this {
    this.checkNotCompleted();
    if (this._defaultArgCount > 0) {
      this.injectAfterDefault = true;
    }
    this._injections.push({ value });
    return this;
  }

  defaultArg(): this {
    this.checkNotCompleted();
    this._defaultArgCount++;
    return this;
  }

  asSingleton() {
    return this.withScope("singleton");
  }

  asTransient() {
    return this.withScope("transient");
  }

  withScope(scope: Scope) {
    this.checkNotCompleted();
    this._scope = scope;
    return this.parent;
  }

  complete(): void {
    this.isComplete = true;
  }

  protected checkNotCompleted() {
    if (this.isComplete) {
      throw new RegistrationCompleteError(this.registrationToken);
    }
  }

  abstract validate(): RegistrationValidationMessages;
  abstract toRegistration(): ContainerRegistration<T>;

  checkInjectAfterDefault(): string {
    return this.injectAfterDefault
      ? `Attempted to inject resolved arguments after a default argument`
      : null;
  }

  checkArgLength(expected: number): string {
    const tokens = this.injections.length;
    const defaultArgs = this._defaultArgCount;
    const expectedArgCount = tokens + defaultArgs;
    return expectedArgCount !== expected
      ? `Expected ${expected} total injections but got ${expectedArgCount} (${tokens} resolved${
          defaultArgs > 0 ? `and ${defaultArgs} default arguments` : ""
        })`
      : null;
  }
}
