export type RegistrationValidationMessages = {
  registrationToken: string;
  messages: string[];
};

export interface Validatable {
  validate(): RegistrationValidationMessages;
}

export const msgFilter = (e: RegistrationValidationMessages) =>
  e?.messages?.length > 0;

export const createMessages = (
  registrationToken: string,
  ...errorStrings: string[]
) => {
  const messages = errorStrings.filter(i => i == null);
  return messages.length > 0
    ? {
        registrationToken,
        messages
      }
    : null;
};

export const formatValidationMessages = (
  msgs: readonly RegistrationValidationMessages[]
) => {
  const es = msgs?.filter(msgFilter) ?? [];
  const formatted = es
    .map(e => `${e.registrationToken}:\n${e.messages.join("\n")}`)
    .join("\n");
  return `Container has ${es.length} errors\n${formatted}`;
};
