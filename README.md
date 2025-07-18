# print-type

A CLI for printing fully-expanded Typescript types from variables, type aliases, etc.

## Install

```sh
npm i -D print-type
```

Or, if you want to use this everywhere:

```sh
npm i -g print-type
```

## Usage

(`npx` should be omitted if you installed this package globally.)

```sh
npx print-type <path-to-file.ts> <name-to-expand>
```

-   `<name-to-expand>`: the name of the thing to expand, whether it be a variable, a type definition, anything.
-   `<path-to-file.ts>`: path to the file that contains the name of the thing to expand.

## Examples

### Big type compared to VS Code

This is an example taken from this package's own test files. You can see the example file here: [`all-the-types.ts`](https://github.com/electrovir/print-type/blob/26779cdd5f6eca60fabf2195220d3257a24f036a/test-files/all-the-types.ts).

```sh
npx print-type test-files/all-the-types.ts ComplexType
```

#### VS Code output

This is all that a VS Code hover will give you. Note the "... 11 more ...;" truncation. Even setting `"noErrorTruncation": true` in your tsconfig isn't always enough to remedy this.

```typescript
{
    id: string;
    name: string;
    age?: number;
    readonly createdAt: Date;
    status: "active" | "inactive" | "pending" | "archived";
    priority: 1 | 2 | 3 | 4 | 5;
    address: {
        street: string;
        city: string;
        zipCode: string;
        country: string;
        coordinates?: {
            lat: number;
            lng: number;
        };
    };
    ... 11 more ...;
    workflow: {
        steps: Array<{
            id: string;
            type: "validation" | "transformation" | "output";
            config: Record<string, any>;
            dependencies?: string[];
            parallel?: boolean;
        }>;
        triggers: {
            manual: boolean;
            scheduled?: {
                cron: string;
                timezone: string;
            };
            webhook?: {
                url: string;
                secret: string;
            };
        };
    };
}
```

#### print-type output

This package prints the following (the full type, even with comments!):

```typescript
{
    // Basic properties
    id: string;
    name: string;
    age?: number;
    readonly createdAt: Date;

    // Union types
    status: 'active' | 'inactive' | 'pending' | 'archived';
    priority: 1 | 2 | 3 | 4 | 5;

    // Nested objects
    address: {
        street: string;
        city: string;
        zipCode: string;
        country: string;
        coordinates?: {
            lat: number;
            lng: number;
        };
    };

    // Arrays and complex collections
    tags: string[];
    scores: number[];
    metadata: Record<string, unknown>;
    permissions: Array<{
        resource: string;
        actions: ('read' | 'write' | 'delete')[];
        granted: boolean;
    }>;

    // Function types
    validate: (input: string) => boolean;
    transform: <T>(data: T) => T;
    onUpdate?: (changes: Partial<ComplexType>) => void;

    // Generic and mapped types
    cache: Map<string, any>;
    settings: {
        [K in 'theme' | 'language' | 'timezone']: string;
    } & {
        notifications: {
            email: boolean;
            push: boolean;
            sms?: boolean;
        };
    };

    // Conditional and template literal types
    apiEndpoints: {
        [K in `get${Capitalize<string>}` | `post${Capitalize<string>}`]: string;
    };

    // Intersection and utility types
    profile: Pick<ComplexType, 'name' | 'age'> & {
        bio?: string;
        avatar?: string;
    };

    // Complex nested structure
    workflow: {
        steps: Array<{
            id: string;
            type: 'validation' | 'transformation' | 'output';
            config: Record<string, any>;
            dependencies?: string[];
            parallel?: boolean;
        }>;
        triggers: {
            manual: boolean;
            scheduled?: {
                cron: string;
                timezone: string;
            };
            webhook?: {
                url: string;
                secret: string;
            };
        };
    };
}
```
