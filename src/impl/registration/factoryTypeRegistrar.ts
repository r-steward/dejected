import { Factory } from "../../types/container";
import { ContainerRegistration } from "../scope/lifetimeScopeRegistration";
import { ContainerError, errorFromMessages } from "../validation/validation";
import { BaseTypeRegistrar } from "./baseTypeRegistrar";

export class FactoryTypeRegistrar<T, TParent> extends BaseTypeRegistrar<
  T,
  TParent
> {
  constructor(
    parent: TParent,
    registrationToken: string,
    private readonly factory: Factory<T>
  ) {
    super(parent, registrationToken);
  }

  toRegistration(): ContainerRegistration<T> {
    const { scope, injections, factory, registrationToken } = this;
    return {
      type: "Factory",
      registrationToken,
      scope,
      injections,
      create: (args: any[]) => factory(...args)
    };
  }

  validate(): ContainerError {
    return errorFromMessages(
      this.registrationToken,
      super.checkArgLength(this.factory.length - 1),
      super.checkInjectAfterDefault()
    );
  }
}
