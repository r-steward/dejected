// tslint:disable-next-line:max-classes-per-file
export class TestTree {
    public nodes: readonly BranchNode[]
    constructor(...input: BranchNode[]) {
        this.nodes = input;
    }
}

// tslint:disable-next-line:max-classes-per-file
export class BranchNode {
    constructor(
        public readonly left: LeafNode,
        public readonly right: LeafNode) { }
}

// tslint:disable-next-line:max-classes-per-file
export class LeafNode {
    constructor(
        public readonly leftLeaf: string,
        public readonly rightLeaf: number
    ) { }
}
