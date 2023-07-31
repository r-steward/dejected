export type RegistrationValidationMessages = {
    registrationToken: string;
    messages: string[];
};
export interface Validatable {
    validate(): RegistrationValidationMessages;
}
export declare const msgFilter: (e: RegistrationValidationMessages) => boolean;
export declare const createMessages: (registrationToken: string, ...errorStrings: string[]) => {
    registrationToken: string;
    messages: string[];
};
export declare const formatValidationMessages: (msgs: readonly RegistrationValidationMessages[]) => string;
