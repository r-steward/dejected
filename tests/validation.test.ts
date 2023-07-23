import { checkCircular } from '../src/impl/validation/circularReference';


describe('Validation test', () => {

    test('Determine circular references', () => {
        // arrange
        const input = createCircularReferences();
        // act
        const output = checkCircular(input, n => n.children);
        // assert
        expect(output.size).toBe(9)
        const testRoute = (ancestor: string, expected: string) => {
            const actual = output.get(ancestor)?.deviantRoutes.join('|');
            expect(actual).toBe(expected);
        }
        testRoute('a', 'a,b,f|a,b,f,g,h,i');
        testRoute('b', 'b,f,a|b,f,g|b,f,g,h,i,a');
        testRoute('c', 'c,d,e');
        testRoute('d', 'd,e,c');
        testRoute('e', 'e,c,d');
        testRoute('f', 'f,a,b|f,g,b|f,g,h,i,a,b');
        testRoute('g', 'g,b,f|g,h,i,a,b,f');
        testRoute('h', 'h,i,a,b,f,g');
        testRoute('i', 'i,a,b,f,g,h');
    });
});

interface Parent {
    key: string;
    children?: readonly string[];
}

function createCircularReferences(): Map<string, Parent> {
    const items: Parent[] = [
        { key: 'a', children: ['b'] },
        { key: 'b', children: ['c', 'f'] },
        { key: 'c', children: ['d'] },
        { key: 'd', children: ['e'] },
        { key: 'e', children: ['c'] },
        { key: 'f', children: ['a', 'g'] },
        { key: 'g', children: ['b', 'd', 'h'] },
        { key: 'h', children: ['i'] },
        { key: 'i', children: ['d', 'a'] },
        { key: 'j' }
    ];
    return new Map(items.map(i => [i.key, i]));
}