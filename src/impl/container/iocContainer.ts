import { Class, Container, Factory, Value } from "../../types/container";
import { DefaultScopeRegistrar } from "../registration/defaultScopeRegistrar";
import { LifetimeScopeNode } from "../scope/lifetimeScopeNode";
import { ParentContainer } from "./parentContainer";

export class IocContainer implements ParentContainer, Container {
  private isDisposed: boolean;
  private readonly scopeRegistrar: DefaultScopeRegistrar<Container>;
  private readonly children: Set<Container> = new Set();

  public static createRootContainer() {
    return new IocContainer(null, new LifetimeScopeNode(null));
  }

  private constructor(
    private readonly parentContainer: ParentContainer,
    private readonly lifetimeScope: LifetimeScopeNode
  ) {
    this.scopeRegistrar = new DefaultScopeRegistrar(this, lifetimeScope);
  }

  resolve<T>(token: string): T {
    this.scopeRegistrar.setCurrentRegistrationToScope();
    return this.lifetimeScope.resolveAtLifetime(token);
  }

  dispose(): void {
    if (!this.isDisposed) {
      this.isDisposed = true;
      this.lifetimeScope.dispose();
      this.children.forEach(c => c.dispose());
      this.children.clear();
      this.parentContainer?.onDispose(this);
    }
  }

  onDispose(child: Container): void {
    this.children.delete(child);
  }

  createChild(): Container {
    this.scopeRegistrar.setCurrentRegistrationToScope();
    const child = new IocContainer(
      this,
      new LifetimeScopeNode(this.lifetimeScope)
    );
    this.children.add(child);
    return child;
  }

  validate(): void {
    throw new Error("Method not implemented.");
  }
  registerClass<T>(token: string, clazz: Class<T>) {
    return this.scopeRegistrar.registerClass(token, clazz);
  }
  registerFactory<T>(token: string, factory: Factory<T>) {
    return this.scopeRegistrar.registerFactory(token, factory);
  }
  registerInstance<T extends object>(token: string, instance: T) {
    return this.scopeRegistrar.registerInstance(token, instance);
  }
  registerValue(token: string, value: Value) {
    return this.scopeRegistrar.registerValue(token, value);
  }
}
