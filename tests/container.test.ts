import { Factory, Scope } from "../src/types/container";
import { newContainer } from "../src/types/rootContainer";
import { LeafNode, TestTree, BranchNode } from "./testClasses";

describe("when container has registrations", () => {

    test("should resolve simple class", () => {
        // arrange
        const container = newContainer()
            .registerValue("testArg1", "testValue")
            .registerValue("testArg2", 2)
            .registerClass("testInstance", LeafNode)
            .inject("testArg1")
            .inject("testArg2")
            .asSingleton();
        // act
        const instance = container.resolve<LeafNode>("testInstance");
        // assert
        expect(instance.leftLeaf).toBe("testValue");
        expect(instance.rightLeaf).toBe(2);
    });

    test("should resolve with factory", () => {
        // arrange
        const resolverFactory: Factory<LeafNode> = () => {
            return new LeafNode(
                'testValue1',
                1
                // c.resolve<string>("testArg1"),
                // c.resolve<number>("testArg2")
            );
        }
        const parameterFactory: Factory<LeafNode> = (arg1: string, arg2: number) => {
            return new LeafNode(arg1, arg2);
        }
        const container = newContainer()
            .registerFactory("testWithoutParameter", resolverFactory)
            .asSingleton()
            .registerFactory("testWithParameter", parameterFactory)
            .inject("testArg3")
            .inject("testArg4")
            .asSingleton()
            .registerValue("testArg1", "testValue1")
            .registerValue("testArg2", 1)
            .registerValue("testArg3", "testValue2")
            .registerValue("testArg4", 2)
            ;
        // act
        const instanceWith = container.resolve<LeafNode>("testWithParameter");
        const instanceWithout = container.resolve<LeafNode>("testWithoutParameter");
        // assert
        expect(instanceWithout.leftLeaf).toBe("testValue1");
        expect(instanceWithout.rightLeaf).toBe(1);
        expect(instanceWith.leftLeaf).toBe("testValue2");
        expect(instanceWith.rightLeaf).toBe(2);
    });

    test.each<Scope>(['singleton', 'transient'])(
        "should resolve class with correct %s scope",
        scope => {
            // arrange
            const container = newContainer();
            container.registerValue("testArg1", "testValue");
            container.registerValue("testArg2", 2);
            container
                .registerClass("testInstance", LeafNode)
                .inject("testArg1")
                .inject("testArg2")
                .withScope(scope);
            // act
            const instance1 = container.resolve<LeafNode>("testInstance");
            const instance2 = container.resolve<LeafNode>("testInstance");
            // assert
            if (scope === 'singleton') {
                expect(instance1).toBe(instance2);
            } else {
                expect(instance1).not.toBe(instance2);
            }
        }
    );

    test("should resolve tree", () => {
        // arrange
        const container = newContainer()
            .registerClass("tree", TestTree)
            .inject("node1")
            .inject("node2")
            .asSingleton()
            .registerInstance('instance', new LeafNode('testD', 4))
            .registerValue("A1", "testA")
            .registerValue("A2", 1)
            .registerValue("B1", "testB")
            .registerValue("B2", 2)
            .registerValue("C1", "testC")
            .registerClass("leafA", LeafNode)
            .inject("A1")
            .inject("A2")
            .asSingleton()
            .registerClass("leafB", LeafNode)
            .inject("B1")
            .inject("B2")
            .asSingleton()
            .registerClass("leafC", LeafNode)
            .inject("C1")
            .injectValue(3)
            .asSingleton()
            .registerClass("node1", BranchNode)
            .inject("leafA")
            .inject("leafB")
            .asSingleton()
            .registerClass("node2", BranchNode)
            .inject("leafC")
            .inject("instance")
            .asSingleton();
        // act
        const instance = container.resolve<TestTree>("tree");
        // assert
        const node1 = instance.nodes[0];
        expect(node1.left.leftLeaf).toBe("testA");
        expect(node1.left.rightLeaf).toBe(1);
        expect(node1.right.leftLeaf).toBe("testB");
        expect(node1.right.rightLeaf).toBe(2);
        const node2 = instance.nodes[1];
        expect(node2.left.leftLeaf).toBe("testC");
        expect(node2.left.rightLeaf).toBe(3);
        expect(node2.right.leftLeaf).toBe("testD");
        expect(node2.right.rightLeaf).toBe(4);
    });
});
