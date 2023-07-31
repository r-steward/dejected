import { Container } from "../src/types/container";
import { newContainer } from "../src/types/rootContainer";
import { DisposableTree } from "./testClasses";

describe("when multiple containers are created", () => {
    let containerL1: Container;
    let containerL2: Container;
    let containerL3: Container;

    beforeEach(() => {
        // empty the instances before each test
        DisposableTree.instances.length = 0;
        // create all levels of container
        createContainers();
    });

    describe("when instances are registered in different scopes", () => {
        it("should retrieve level 1 instances", () => {
            const instances = resolveAllInstances(containerL1, 2);
            testResolvedInstanceTree(
                instances,
                "A1,B1,C1,D1",
                "B1,C1,D1",
                "C1,D1",
                "D1"
            );
            // B is a singleton
            testSingletons(instances, false, true, false, false);
            // should create 2A, 1B, 3C, 3D
            expect(getCreatedInstances("A1").length).toBe(2);
            expect(getCreatedInstances("B1").length).toBe(1);
            expect(getCreatedInstances("C1").length).toBe(3);
            expect(getCreatedInstances("D1").length).toBe(5);
            expect(DisposableTree.instances.length).toBe(11);
        });

        it("should retrieve level 2 instances", () => {
            const instances = resolveAllInstances(containerL2, 2);
            testResolvedInstanceTree(
                instances,
                "A2,B2,C2,D1",
                "B2,C2,D1",
                "C2,D1",
                "D1"
            );
            // A is a singleton
            testSingletons(instances, true, false, false, false);
            // should create 1A, 3B, 5C, 7D
            expect(getCreatedInstances("A2").length).toBe(1);
            expect(getCreatedInstances("B2").length).toBe(3);
            expect(getCreatedInstances("C2").length).toBe(5);
            expect(getCreatedInstances("D1").length).toBe(7);
            expect(DisposableTree.instances.length).toBe(16);
        });

        it("should retrieve level 3 instances", () => {
            const instances = resolveAllInstances(containerL3, 2);
            testResolvedInstanceTree(
                instances,
                "A2,B2,C2,D1",
                "B3,C2,D3",
                "C2,D3",
                "D3"
            );
            // A is a singleton
            expect(instances.a[0] === instances.a[1]).toBeTruthy();
            // B is not a singleton
            expect(instances.b[0] === instances.b[1]).toBeFalsy();
            // should create 1A, 3B, 5C, 7D
            expect(getCreatedInstances("A2").length).toBe(1);
            expect(getCreatedInstances("B2").length).toBe(1);
            expect(getCreatedInstances("B3").length).toBe(2);
            expect(getCreatedInstances("C2").length).toBe(5);
            expect(getCreatedInstances("D1").length).toBe(1);
            expect(getCreatedInstances("D3").length).toBe(1);
            expect(DisposableTree.instances.length).toBe(11);
        });
    });

    describe("when all instances are resolved", () => {
        const resolveCount = 2;

        beforeEach(() => {
            resolveAllInstances(containerL1, resolveCount);
            resolveAllInstances(containerL2, resolveCount);
            resolveAllInstances(containerL3, resolveCount);
        });

        it("the correct number of instances should have been created", () => {
            // singletons
            expect(getCreatedInstances("B1").length).toBe(1);
            expect(getCreatedInstances("A2").length).toBe(1);
            expect(getCreatedInstances("D3").length).toBe(1);
            // transient
            expect(getCreatedInstances("A1").length).toBe(resolveCount);
            expect(getCreatedInstances("C1").length).toBe(1 + resolveCount);
            expect(getCreatedInstances("D1").length).toBe(2 + 5 * resolveCount);
            expect(getCreatedInstances("B2").length).toBe(1 + resolveCount);
            expect(getCreatedInstances("C2").length).toBe(1 + 4 * resolveCount);
            expect(getCreatedInstances("B3").length).toBe(resolveCount);
            // total
            expect(DisposableTree.instances.length).toBe(8 + 13 * resolveCount);
        });

        it("should only dispose level 3 items", () => {
            // act
            containerL3.dispose();
            // assert
            const stats = getDisposedStatistics();
            expect(stats).toMatchInlineSnapshot(`
        {
          "active": {
            "A1": 2,
            "A2": 1,
            "B1": 1,
            "B2": 3,
            "C1": 3,
            "C2": 5,
            "D1": 12,
          },
          "disposed": {
            "B3": 2,
            "C2": 4,
            "D3": 1,
          },
        }
      `);
        });

        it("should dispose level 2 and 3 items", () => {
            // act
            containerL2.dispose();
            // assert
            const stats = getDisposedStatistics();
            expect(stats).toMatchInlineSnapshot(`
        {
          "active": {
            "A1": 2,
            "B1": 1,
            "C1": 3,
            "D1": 5,
          },
          "disposed": {
            "A2": 1,
            "B2": 3,
            "B3": 2,
            "C2": 9,
            "D1": 7,
            "D3": 1,
          },
        }
      `);
        });

        it("should dispose all items", () => {
            // act
            containerL1.dispose();
            // assert
            const stats = getDisposedStatistics();
            expect(stats).toMatchInlineSnapshot(`
        {
          "active": {},
          "disposed": {
            "A1": 2,
            "A2": 1,
            "B1": 1,
            "B2": 3,
            "B3": 2,
            "C1": 3,
            "C2": 9,
            "D1": 12,
            "D3": 1,
          },
        }
      `);
        });
    });

    function testResolvedInstanceTree(
        items: ResolvedItems,
        aTree: string,
        bTree: string,
        cTree: string,
        dTree: string
    ) {
        items.a.forEach(i => expect(i.treeName).toBe(aTree));
        items.b.forEach(i => expect(i.treeName).toBe(bTree));
        items.c.forEach(i => expect(i.treeName).toBe(cTree));
        items.d.forEach(i => expect(i.treeName).toBe(dTree));
    }

    function testSingletons(
        items: ResolvedItems,
        isA: boolean,
        isB: boolean,
        isC: boolean,
        isD: boolean
    ) {
        const testSingleton = (isSingleton: boolean) => (
            m: DisposableTree,
            i: DisposableTree
        ) => {
            if (m != null) {
                if (isSingleton) {
                    expect(m === i).toBeTruthy();
                } else {
                    expect(m === i).toBeFalsy();
                }
            }
            return i;
        };
        items.a.reduce(testSingleton(isA));
        items.b.reduce(testSingleton(isB));
        items.c.reduce(testSingleton(isC));
        items.d.reduce(testSingleton(isD));
    }

    function resolveAllInstances(container: Container, count: number) {
        return {
            a: resolveMultiple(container, "instanceA", count),
            b: resolveMultiple(container, "instanceB", count),
            c: resolveMultiple(container, "instanceC", count),
            d: resolveMultiple(container, "instanceD", count)
        };
    }
    function resolveMultiple(container: Container, token: string, count: number) {
        return [...Array(count)].map(_ => container.resolve<DisposableTree>(token));
    }

    function getCreatedInstances(name: string): DisposableTree[] {
        return DisposableTree.instances.filter(i => i.name === name);
    }

    function getDisposedStatistics() {
        const addItem = (name: string, o: { [k: string]: number }) => {
            o[name] == null ? (o[name] = 1) : o[name]++;
            return o;
        };
        return DisposableTree.instances.reduce(
            (m, i) => {
                const name = i.name;
                const disposed = i.disposed ? addItem(name, m.disposed) : m.disposed;
                const active = i.disposed ? m.active : addItem(name, m.active);
                return { disposed, active };
            },
            { disposed: {} as { [k: string]: number }, active: {} }
        );
    }

    function createContainers() {
        // L1
        // A(t)B(s)C(t)D(t)
        // L2
        // A(s)B(t)C(t)
        // L3
        // B(t)D(s)
        // Creations:
        // L1 (A1:n, B1:1, C1:1+n, D1:1+2n)
        // L2 (A2:1, B2:1+n, C2:1+2n, D1:1+3n)
        // L3 (A2:0, B3:n, C2:2n, D3: 3n)

        containerL1 = newContainer()
            .registerClass("instanceA", DisposableTree)
            .injectValue("A1")
            .inject("instanceB")
            .asTransient()
            .registerClass("instanceB", DisposableTree)
            .injectValue("B1")
            .inject("instanceC")
            .asSingleton()
            .registerClass("instanceC", DisposableTree)
            .injectValue("C1")
            .inject("instanceD")
            .asTransient()
            .registerClass("instanceD", DisposableTree)
            .injectValue("D1")
            .asTransient();
        containerL2 = containerL1
            .createChild()
            .registerClass("instanceA", DisposableTree)
            .injectValue("A2")
            .inject("instanceB")
            .asSingleton()
            .registerClass("instanceB", DisposableTree)
            .injectValue("B2")
            .inject("instanceC")
            .asTransient()
            .registerClass("instanceC", DisposableTree)
            .injectValue("C2")
            .inject("instanceD")
            .asTransient();
        containerL3 = containerL2
            .createChild()
            .registerClass("instanceB", DisposableTree)
            .injectValue("B3")
            .inject("instanceC")
            .asTransient()
            .registerClass("instanceD", DisposableTree)
            .injectValue("D3")
            .asSingleton();
    }
});

type ResolvedItems = {
    a: DisposableTree[];
    b: DisposableTree[];
    c: DisposableTree[];
    d: DisposableTree[];
};
