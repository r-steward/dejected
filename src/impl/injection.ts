import { Value } from "../types/container";

export interface TokenInjection {
  token: string;
}
export interface ValueInjection {
  value: Value;
}
export type Injection = TokenInjection | ValueInjection;

export const isTokenInjection = (i: Injection): i is TokenInjection => {
  return (i as TokenInjection).token != null;
};
