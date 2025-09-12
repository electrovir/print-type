import {PathTree} from 'spa-router-vir';

type ComplexType = {
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
};

const mockPathTree = new PathTree({
    allowBare: true,
    children: {
        app: {
            allowBare: true,
            children: {
                uploads: {
                    allowBare: false,
                    children: {
                        patients: {
                            disable: true,
                            children: {},
                            allowBare: true,
                        },
                        files: {
                            allowBare: true,
                            children: {
                                ':file-path': {
                                    allowBare: true,
                                    children: {
                                        view: {},
                                    },
                                },
                            },
                        },
                    },
                },
                settings: {
                    allowBare: true,
                    children: {
                        disabled: {
                            allowBare: true,
                            disable: true,
                            children: {},
                        },
                    },
                },
            },
        },
        withAny: {
            anyChildren: true,
        },
        legal: {},
    },
});
