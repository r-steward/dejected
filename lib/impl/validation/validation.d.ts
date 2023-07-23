export type ContainerError = {
    registrationToken: string;
    messages: string[];
};
export interface Validatable {
    validate(): ContainerError;
}
export declare const errorFilter: (e: ContainerError) => boolean;
export declare const errorFromMessages: (registrationToken: string, ...errorStrings: string[]) => {
    registrationToken: string;
    messages: string[];
};
export declare const formatErrors: (errors: readonly ContainerError[]) => string;
