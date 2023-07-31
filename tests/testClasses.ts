import { Disposable } from "../src/types/disposable";

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

// tslint:disable-next-line:max-classes-per-file
export class DisposableTree implements Disposable {
    public static readonly instances: DisposableTree[] = [];
    private _isDisposed: boolean;

    constructor(
        public readonly name: string,
        public readonly child: DisposableTree
    ) {
        DisposableTree.instances.push(this);
    }

    public get disposed(): boolean {
        return this._isDisposed;
    }

    public get treeName(): string {
        return `${this.name}${this.child != null ? `,${this.child.treeName}` : ''}`;
    }

    dispose(): void {
        this._isDisposed = true;
    }
}
