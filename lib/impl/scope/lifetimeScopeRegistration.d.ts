import { Scope } from "../../types/container";
import { Injection } from "../injection";
export type InstanceResolveType = {
    type: "Instance";
};
export type ClassResolveType = {
    type: "Class";
};
export type ValueResolveType = {
    type: "Value";
    valueType: string;
};
export type FactoryResolveType = {
    type: "Factory";
};
export type ResolveType = ClassResolveType | FactoryResolveType | InstanceResolveType | ValueResolveType;
export type ConstantResolveType = ValueResolveType | InstanceResolveType;
export type CreationResolveType = ClassResolveType | FactoryResolveType;
export type TypeRegistration<T> = CreationResolveType & {
    readonly registrationToken: string;
    readonly scope: Scope;
    readonly injections: readonly Injection[];
    readonly create: (args: any[]) => T;
};
export type ValueRegistration<T> = ConstantResolveType & {
    readonly registrationToken: string;
    readonly value: T;
};
export type ContainerRegistration<T = unknown> = TypeRegistration<T> | ValueRegistration<T>;
export declare const isTypeRegistration: <T>(r: ContainerRegistration<T>) => r is TypeRegistration<T>;
export declare const isSingletonRegistration: <T>(r: TypeRegistration<T>) => boolean;
