export type ContainerError = {
  registrationToken: string;
  messages: string[];
};

export interface Validatable {
  validate(): ContainerError;
}
export const errorFilter = (e: ContainerError) => e?.messages?.length > 0;

export const errorFromMessages = (
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

export const formatErrors = (errors: readonly ContainerError[]) => {
  const es = errors?.filter(errorFilter) ?? [];
  const formatted = es
    .map(e => `${e.registrationToken}:\n${e.messages.join("\n")}`)
    .join("\n");
  return `Container has ${es.length} errors\n${formatted}`;
};
