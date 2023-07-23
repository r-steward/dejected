import { Container } from "../../types/container";

export interface ParentContainer {
  onDispose(child: Container): void;
}
