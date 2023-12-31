import { Class, Container, Factory, Value } from "../../types/container";
import { ParentContainer } from "./parentContainer";
export declare class IocContainer implements ParentContainer, Container {
    private readonly parentContainer;
    private readonly lifetimeScope;
    private isDisposed;
    private readonly scopeRegistrar;
    private readonly children;
    static createRootContainer(): IocContainer;
    private constructor();
    resolve<T>(token: string): T;
    dispose(): void;
    onDispose(child: Container): void;
    createChild(): Container;
    validate(): void;
    registerClass<T>(token: string, clazz: Class<T>): import("../registration/scopeRegistrar").TypeRegistrar<Container>;
    registerFactory<T>(token: string, factory: Factory<T>): import("../registration/scopeRegistrar").TypeRegistrar<Container>;
    registerInstance<T extends object>(token: string, instance: T): Container;
    registerValue(token: string, value: Value): Container;
}
