import { Container } from "../src/types/container";
import { newContainer } from "../src/types/rootContainer";
import { LeafNode } from "./testClasses";

describe("when parent container is created", () => {
    let parentContainer: Container;

    beforeEach(() => {
        parentContainer = newContainer()
            .registerValue("arg1", "parentValue")
            .registerValue("arg2", 2)
            .registerClass("testInstance", LeafNode)
            .inject("arg1")
            .inject("arg2")
            .asSingleton();

    })

    testParentValueResolved();

    describe("when child container is created", () => {
        let childContainer: Container;

        beforeEach(() => {
            childContainer = parentContainer.createChild()
                .registerValue("arg1", "childValue")
                .registerClass("childClass", LeafNode)
                .injectValue('childLeaf')
                .injectValue(10)
                .asSingleton();
        })

        testParentValueResolved();


    });

    function testParentValueResolved() {
        test("parent values should be resolved", () => {
            // act
            const instance = parentContainer.resolve<LeafNode>("testInstance");
            // assert
            expect(instance.leftLeaf).toBe("parentValue");
            expect(instance.rightLeaf).toBe(2);
        });
    }

    function testChildValueResolved() {
        test("child values should be resolved", () => {
            // act
            const instance = parentContainer.resolve<LeafNode>("testInstance");
            // assert
            expect(instance.leftLeaf).toBe("testValue");
            expect(instance.rightLeaf).toBe(2);
        });
    }



});