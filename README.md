# dejected

* Straight forward dependency injection.
* No need to change existing code, or turn on annotations.
* Supports multiple lifetime scoping and object disposal.
* Easy to use fluent interface.

# Installation

Install using npm

```
npm install dejected
```

# Usage

To use dejected in your code simply create containers, register items (classes, factories, instances, or primitive values), and resolve.

### At a glance

```typescript
import { newContainer } from 'dejected';

const rootContainer = newContainer()
            .registerClass("userClient", UserClient)
            .inject("clientUrl")
            .asSingleton()
            .registerClass("userService", UserService)
            .inject("userClient")
            .asSingleton()
            .registerClass("eventBus", EventBus)
            .asTransient();

const childContainer = rootContainer
            .createChild()
            .registerClass("userService", OtherUserService)
            .inject("userClient")
            .asSingleton();

rootContainer.registerValue("clientUrl", "https://a.b.c/1010");

const userService = childContainer.resolve("userService");
const eventBus = childContainer.resolve("eventBus");

childContainer.dispose();
rootContainer.dispose(); 
  
```

### Registering items in a container

The following items can be registered in a container, using a unique token identifier:
* Constructors
* Factories (functions that return items)
* Instances (objects)
* Values (numbers, strings, or undefined)

Constructors and Factories can be registered with the following scope:
* Singleton - the constructor or factory will be called only once, and will return the same item on subsequent calls.
* Transient - the constructor or factory will be called every time a resolve from the container takes place.

Dependencies are injected in the order specified, and are defined using:
* inject - provide the relevant token and the dependency will be resolved from the container on construction
* injectValue - provide a primitive value (number or string) which will be used as the dependency
* defaultArg - use this when a constructor/factory has a default argument (optional)
  
### Lifetime Scopes

The containers support a tree structure of lifetime containers. 
* You can create multiple children from any level of container.
* Dependencies will be resolved from the current scope or above.
* Therefore singleton objects will not have dependencies in a child scope.
* When a container is disposed, any child containers will also be disposed. 

