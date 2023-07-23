import { Disposable } from "../../types/disposable";
import { DisposedError, ResolveError } from "../errors";
import { isTokenInjection } from "../injection";
import {
  MutableLifetimeScope,
  ResolutionContext,
  TraversableLifetimeScope,
  isDisposable
} from "./lifetimeScope";
import {
  ContainerRegistration,
  TypeRegistration,
  isSingletonRegistration,
  isTypeRegistration
} from "./lifetimeScopeRegistration";

export class LifetimeScopeNode
  implements TraversableLifetimeScope, MutableLifetimeScope {
  private _isDisposed: boolean;

  private readonly registrations: Map<
    string,
    ContainerRegistration
  > = new Map();
  private readonly scopeTransients: Disposable[] = [];
  private readonly scopeSingletons: Map<string, unknown> = new Map();

  constructor(private readonly parentScope: TraversableLifetimeScope) {}

  get isDisposed() {
    return this._isDisposed;
  }

  register<T>(registration: ContainerRegistration<T>): this {
    this._checkDisposed();
    this.registrations.set(registration.registrationToken, registration);
    return this;
  }

  resolveAtLifetime<T>(token: string): T {
    this._checkDisposed();
    const context: ResolutionContext = {
      headScope: this,
      resolutionRoute: new Set([token]),
      resolvedTransientItems: []
    };
    const resolved = this.resolveWithContext<T>(token, context);
    this.scopeTransients.push(...context.resolvedTransientItems);
    return resolved;
  }

  resolveWithContext<T>(token: string, context: ResolutionContext): T {
    this._checkDisposed();
    const scopedRegistration = this.registrations.get(
      token
    ) as ContainerRegistration<T>;
    if (scopedRegistration) {
      if (isTypeRegistration(scopedRegistration)) {
        return this.resolveLocalType(scopedRegistration, context);
      } else {
        return scopedRegistration.value as T;
      }
    } else {
      if (this.parentScope == null) {
        throw ResolveError.create(token, "NoToken");
      }
      return this.parentScope.resolveWithContext(token, context);
    }
  }

  dispose(): void {
    if (!this.isDisposed) {
      this._isDisposed = true;
      // dispose singletons
      this.scopeSingletons.forEach(s => {
        if (isDisposable(s)) {
          s.dispose();
        }
      });
      // dispose transients
      this.scopeTransients.forEach(t => t.dispose());
    }
  }

  private resolveLocalType<T>(
    r: TypeRegistration<T>,
    context: ResolutionContext
  ) {
    let resolvedItem = null;
    let resolveContext = context;
    // if resolution has singleton parent, only resolve from this scope or above
    const isSingleton = isSingletonRegistration(r);
    if (isSingleton) {
      // look up item
      resolvedItem = this._getLocalScopeSingleton<T>(r.registrationToken);
      if (!resolvedItem) {
        resolveContext = this._setAsHeadScope(context);
      }
    }
    if (!resolvedItem) {
      const args = this._resolveArgs(r, resolveContext);
      resolvedItem = this._createItem<T>(r, args);
      if (isSingleton) {
        // if it's a singleton, it should be saved on this scope
        this._saveLocalScopeSingleton(r.registrationToken, resolvedItem);
      } else {
        // it it's a transient, it should be saved to the context
        this._pushDisposableTransientToContext(resolvedItem, context);
      }
    }
    return resolvedItem;
  }

  private _resolveArgs<T>(
    registration: TypeRegistration<T>,
    context: ResolutionContext
  ): unknown[] {
    return registration.injections.map(i => {
      if (isTokenInjection(i)) {
        const childToken = i.token;
        const currentRoute = context.resolutionRoute;
        if (currentRoute.has(childToken)) {
          throw ResolveError.create(registration.registrationToken, "Circular");
        }
        return context.headScope.resolveWithContext(childToken, {
          ...context,
          resolutionRoute: new Set([...currentRoute, childToken])
        });
      }
      return i.value;
    });
  }

  private _createItem<T>(registration: TypeRegistration<T>, args: unknown[]) {
    try {
      return registration.create(args);
    } catch (e) {
      throw ResolveError.create(registration?.registrationToken, "Creation");
    }
  }

  private _getLocalScopeSingleton<T>(token: string) {
    return this.scopeSingletons.get(token) as T;
  }

  private _saveLocalScopeSingleton<T>(token: string, singletonValue: T) {
    return this.scopeSingletons.set(token, singletonValue);
  }

  private _pushDisposableTransientToContext<T>(
    resolvedItem: T,
    context: ResolutionContext
  ) {
    if (isDisposable(resolvedItem)) {
      context.resolvedTransientItems.push(resolvedItem);
    }
  }

  private _checkDisposed() {
    if (this.isDisposed) {
      throw new DisposedError();
    }
  }

  private _setAsHeadScope(context: ResolutionContext): ResolutionContext {
    return {
      ...context,
      headScope: this
    };
  }
}
