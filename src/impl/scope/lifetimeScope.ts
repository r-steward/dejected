import { Disposable } from "../../types/disposable";
import { RegistrationValidationMessages } from "../validation/validation";
import { ContainerRegistration } from "./lifetimeScopeRegistration";

export interface LifetimeScope extends Disposable {
  resolveAtLifetime<T>(token: string): T;
}

export interface TraversableLifetimeScope {
  resolveWithContext<T>(token: string, context: ResolutionContext): T;
}

export interface MutableLifetimeScope extends LifetimeScope {
  isDisposed: boolean;
  register<T>(registration: ContainerRegistration<T>): this;
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

export const isDisposable = (obj: any): obj is Disposable => {
  const disposeFunction = obj?.dispose;
  return typeof disposeFunction === "function" && disposeFunction.length === 0;
};
