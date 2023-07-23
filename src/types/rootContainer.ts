import { IocContainer } from "../impl/container/iocContainer";
import { Container } from "./container";

export const newContainer: () => Container = () =>
  IocContainer.createRootContainer();
