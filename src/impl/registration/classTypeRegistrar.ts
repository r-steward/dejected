import { Class } from "../../types/container";
import { ContainerRegistration } from "../scope/lifetimeScopeRegistration";
import { ContainerError, errorFromMessages } from "../validation/validation";
import { BaseTypeRegistrar } from "./baseTypeRegistrar";

export class ClassTypeRegistrar<T, TParent> extends BaseTypeRegistrar<
  T,
  TParent
> {
  constructor(
    parent: TParent,
    registrationToken: string,
    private readonly clazz: Class<T>
  ) {
    super(parent, registrationToken);
  }

  toRegistration(): ContainerRegistration<T> {
    const { scope, injections, clazz, registrationToken } = this;
    return {
      type: "Class",
      registrationToken,
      scope,
      injections,
      create: (args: any[]) => new clazz(...args)
    };
  }

  validate(): ContainerError {
    return errorFromMessages(
      this.registrationToken,
      super.checkArgLength(this.clazz.length),
      super.checkInjectAfterDefault()
    );
  }
}
