import { newContainer } from "../src/types/rootContainer";
import { LeafNode } from "./testClasses";

describe("when registration has errors", () => {

    test("should throw missing token error on resolve", () => {
        // arrange
        const container = newContainer();
        container.registerValue("testArg1", "testValue");
        container
            .registerClass("testInstance", LeafNode)
            .inject("testArg1")
            .inject("testArg2")
            .asSingleton();
        // act
        expect(() => {
            container.resolve("testInstance");
        }).toThrowErrorMatchingInlineSnapshot(
            `"Container trying to resolve token <testArg2> but it is not registered"`
        );
    });

    test("should throw circular dependency error on resolve", () => {
        // arrange
        const container = newContainer()
            .registerValue("testArg1", "testValue")
            .registerValue("testArg2", 2)
            .registerClass("testInstance1", LeafNode)
            .inject("testArg1")
            .inject("testInstance2")
            .asSingleton()
            .registerClass("testInstance2", LeafNode)
            .inject("testArg1")
            .inject("testInstance1")
            .asSingleton()
        // act
        expect(() => {
            container.resolve("testInstance1");
        }).toThrowErrorMatchingInlineSnapshot(
            `"Container found circular reference resolving token <testInstance2>"`
        );
    });
});

