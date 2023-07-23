import { ContainerError, errorFilter } from "./validation/validation";

export const formatErrors = (errors: readonly ContainerError[]) => {
  const es = errors?.filter(errorFilter) ?? [];
  const formatted = es
    .map(e => `${e.registrationToken}:\n${e.messages.join("\n")}`)
    .join("\n");
  return `Container has ${es.length} errors\n${formatted}`;
};

export abstract class DejectedError extends Error {}

// tslint:disable-next-line:max-classes-per-file
export class DisposedError extends DejectedError {
  constructor() {
    super(`Container is disposed and can no longer be used.`);
  }
}

// tslint:disable-next-line:max-classes-per-file
export class RegistrationCompleteError extends DejectedError {
  constructor(token: string) {
    super(
      `Registration for token ${token} is complete. This registrar can no longer be used.`
    );
  }
}

// tslint:disable-next-line:max-classes-per-file
export class ValidationError extends DejectedError {
  constructor(error: readonly ContainerError[]) {
    super(formatErrors(error));
  }
}

type ResolveErrorType = "NoToken" | "Circular" | "Creation";
// tslint:disable-next-line:max-classes-per-file
export class ResolveError extends DejectedError {
  private constructor(message: string) {
    super(message);
  }
  public static create(token: string, type: ResolveErrorType) {
    switch (type) {
      case "NoToken":
        return new ResolveError(
          `Container trying to resolve token <${token}> but it is not registered`
        );
      case "Circular":
        return new ResolveError(
          `Container found circular reference resolving token <${token}>`
        );
      case "Creation":
        return new ResolveError(`Failed to create item for <${token}>`);
    }
  }
}
