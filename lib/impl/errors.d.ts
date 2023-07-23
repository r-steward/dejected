import { ContainerError } from "./validation/validation";
export declare const formatErrors: (errors: readonly ContainerError[]) => string;
export declare abstract class DejectedError extends Error {
}
export declare class DisposedError extends DejectedError {
    constructor();
}
export declare class RegistrationCompleteError extends DejectedError {
    constructor(token: string);
}
export declare class ValidationError extends DejectedError {
    constructor(error: readonly ContainerError[]);
}
type ResolveErrorType = "NoToken" | "Circular" | "Creation";
export declare class ResolveError extends DejectedError {
    private constructor();
    static create(token: string, type: ResolveErrorType): ResolveError;
}
export {};
