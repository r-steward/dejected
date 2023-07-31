import { Class, Factory, Value } from "../../types/container";
import { MutableLifetimeScope } from "../scope/lifetimeScope";
import { RegistrationValidationMessages } from "../validation/validation";
import { ClassTypeRegistrar } from "./classTypeRegistrar";
import { FactoryTypeRegistrar } from "./factoryTypeRegistrar";
import {
  ScopeRegistrar,
  ScopeTypeRegistrar,
  TypeRegistrar
} from "./scopeRegistrar";

export class DefaultScopeRegistrar<TParent> implements ScopeRegistrar<TParent> {
  constructor(
    private readonly parent: TParent,
    protected readonly lifetimeScope: MutableLifetimeScope
  ) {}

  private readonly validation: Map<
    string,
    RegistrationValidationMessages
  > = new Map();
  private currentType: ScopeTypeRegistrar<unknown, TParent>;

  registerClass<T>(token: string, clazz: Class<T>): TypeRegistrar<TParent> {
    return this._setCurrentRegistrar(
      new ClassTypeRegistrar(this.parent, token, clazz)
    );
  }

  registerFactory<T>(
    token: string,
    factory: Factory<T>
  ): TypeRegistrar<TParent> {
    return this._setCurrentRegistrar(
      new FactoryTypeRegistrar(this.parent, token, factory)
    );
  }

  registerInstance<T extends object>(token: string, instance: T): TParent {
    return this._setInstance(token, instance);
  }

  registerValue(token: string, value: Value): TParent {
    return this._setValue(token, value);
  }

  setCurrentRegistrationToScope() {
    if (this.currentType) {
      this.currentType.complete();
      this.addValidation(this.currentType.validate());
      this.lifetimeScope.register(this.currentType.toRegistration());
      this.currentType = null;
    }
  }

  addValidation(msg: RegistrationValidationMessages): this {
    if (msg) {
      if (msg.messages?.length > 0) {
        this.validation.set(msg.registrationToken, msg);
      } else {
        this.validation.delete(msg.registrationToken);
      }
    }
    return this;
  }

  private _setCurrentRegistrar<T>(
    typeRegistrar: ScopeTypeRegistrar<T, TParent>
  ): TypeRegistrar<TParent> {
    this.setCurrentRegistrationToScope();
    this.currentType = typeRegistrar;
    return this.currentType;
  }

  private _setValue<T>(token: string, value: Value) {
    this.setCurrentRegistrationToScope();
    this.lifetimeScope.register({
      type: "Value",
      valueType: typeof value,
      registrationToken: token,
      value
    });
    return this.parent;
  }

  private _setInstance<T>(token: string, value: T) {
    this.setCurrentRegistrationToScope();
    this.lifetimeScope.register({
      type: "Instance",
      registrationToken: token,
      value
    });
    return this.parent;
  }
}
