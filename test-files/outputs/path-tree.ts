export type Output = {
    readonly tree: Readonly<{
        allowBare: true;
        children: Readonly<{
            app: Readonly<{
                allowBare: true;
                children: Readonly<{
                    uploads: Readonly<{
                        allowBare: false;
                        children: Readonly<{
                            patients: Readonly<{
                                disable: true;
                                allowBare: true;
                            }>;
                            files: Readonly<{
                                allowBare: true;
                                children: {
                                    ':file-path': Readonly<{
                                        allowBare: true;
                                        children: Readonly<{
                                            view: {};
                                        }>;
                                    }>;
                                };
                            }>;
                        }>;
                    }>;
                    settings: Readonly<{
                        allowBare: true;
                        children: Readonly<{
                            disabled: Readonly<{
                                allowBare: true;
                                disable: true;
                                children: {};
                            }>;
                        }>;
                    }>;
                }>;
            }>;
            withAny: Readonly<{
                anyChildren: true;
            }>;
            legal: {};
        }>;
    }>;
    readonly paths: {
        path: '';
        fullPaths: Readonly<[]>;
        PathsType:
            | Readonly<[]>
            | Readonly<['app']>
            | Readonly<['app', 'uploads', 'patients']>
            | Readonly<['app', 'uploads', 'files']>
            | Readonly<['app', 'uploads', 'files', string]>
            | Readonly<['app', 'uploads', 'files', string, 'view']>
            | Readonly<['app', 'settings']>
            | Readonly<['app', 'settings', 'disabled']>
            | Readonly<['withAny', string]>
            | Readonly<['legal']>;
        children: Readonly<{
            app: {
                path: 'app';
                fullPaths: Readonly<['app']>;
                PathsType:
                    | Readonly<['app']>
                    | Readonly<['app', 'uploads', 'patients']>
                    | Readonly<['app', 'uploads', 'files']>
                    | Readonly<['app', 'uploads', 'files', string]>
                    | Readonly<['app', 'uploads', 'files', string, 'view']>
                    | Readonly<['app', 'settings']>
                    | Readonly<['app', 'settings', 'disabled']>;
                children: Readonly<{
                    uploads: {
                        path: 'uploads';
                        fullPaths: Readonly<['app', 'uploads']>;
                        PathsType:
                            | Readonly<['app', 'uploads', 'patients']>
                            | Readonly<['app', 'uploads', 'files']>
                            | Readonly<['app', 'uploads', 'files', string]>
                            | Readonly<['app', 'uploads', 'files', string, 'view']>;
                        children: Readonly<{
                            patients: {
                                path: 'patients';
                                fullPaths: Readonly<['app', 'uploads', 'patients']>;
                                PathsType: Readonly<['app', 'uploads', 'patients']>;
                                children: {};
                            };
                            files: {
                                path: 'files';
                                fullPaths: Readonly<['app', 'uploads', 'files']>;
                                PathsType:
                                    | Readonly<['app', 'uploads', 'files']>
                                    | Readonly<['app', 'uploads', 'files', string]>
                                    | Readonly<['app', 'uploads', 'files', string, 'view']>;
                                children: {
                                    ':file-path': {
                                        path: string;
                                        fullPaths: Readonly<['app', 'uploads', 'files', string]>;
                                        PathsType:
                                            | Readonly<['app', 'uploads', 'files', string]>
                                            | Readonly<['app', 'uploads', 'files', string, 'view']>;
                                        children: Readonly<{
                                            view: {
                                                path: 'view';
                                                fullPaths: Readonly<
                                                    ['app', 'uploads', 'files', string, 'view']
                                                >;
                                                PathsType: Readonly<
                                                    ['app', 'uploads', 'files', string, 'view']
                                                >;
                                                children: {};
                                            };
                                        }>;
                                    } & {
                                        fill: {
                                            <PathParam extends string = string>(
                                                pathParam: PathParam,
                                            ): {
                                                path: PathParam;
                                                fullPaths: Readonly<
                                                    ['app', 'uploads', 'files', PathParam]
                                                >;
                                                PathsType: {} | {};
                                                children: Readonly<{
                                                    view: {
                                                        path: 'view';
                                                        fullPaths: Readonly<
                                                            [
                                                                'app',
                                                                'uploads',
                                                                'files',
                                                                PathParam,
                                                                'view',
                                                            ]
                                                        >;
                                                        PathsType: {};
                                                        children: {};
                                                    };
                                                }>;
                                            };
                                        };
                                    };
                                };
                            };
                        }>;
                    };
                    settings: {
                        path: 'settings';
                        fullPaths: Readonly<['app', 'settings']>;
                        PathsType:
                            | Readonly<['app', 'settings']>
                            | Readonly<['app', 'settings', 'disabled']>;
                        children: Readonly<{
                            disabled: {
                                path: 'disabled';
                                fullPaths: Readonly<['app', 'settings', 'disabled']>;
                                PathsType: Readonly<['app', 'settings', 'disabled']>;
                                children: {};
                            };
                        }>;
                    };
                }>;
            };
            withAny: {
                path: 'withAny';
                fullPaths: Readonly<['withAny']>;
                PathsType: Readonly<['withAny', string]>;
                children: {};
            };
            legal: {
                path: 'legal';
                fullPaths: Readonly<['legal']>;
                PathsType: Readonly<['legal']>;
                children: {};
            };
        }>;
    };
    readonly pathsWithoutTypes: Readonly<{
        children: Readonly<{
            app: Readonly<{
                children: Readonly<{
                    uploads: Readonly<{
                        children: Readonly<{
                            patients: Readonly<{
                                children: {};
                                path: 'patients';
                                fullPaths: Readonly<['app', 'uploads', 'patients']>;
                            }>;
                            files: Readonly<{
                                children: {
                                    ':file-path': {
                                        readonly children: Readonly<{
                                            view: Readonly<{
                                                children: {};
                                                path: 'view';
                                                fullPaths: Readonly<
                                                    ['app', 'uploads', 'files', string, 'view']
                                                >;
                                            }>;
                                        }>;
                                        readonly path: string;
                                        readonly fullPaths: Readonly<
                                            ['app', 'uploads', 'files', string]
                                        >;
                                        fill: {
                                            (pathParam: string): Readonly<{
                                                children: Readonly<{
                                                    view: Readonly<{
                                                        children: {};
                                                        path: 'view';
                                                        fullPaths: Readonly<
                                                            [
                                                                'app',
                                                                'uploads',
                                                                'files',
                                                                string,
                                                                'view',
                                                            ]
                                                        >;
                                                    }>;
                                                }>;
                                                path: string;
                                                fullPaths: Readonly<
                                                    ['app', 'uploads', 'files', string]
                                                >;
                                            }>;
                                        };
                                    };
                                };
                                path: 'files';
                                fullPaths: Readonly<['app', 'uploads', 'files']>;
                            }>;
                        }>;
                        path: 'uploads';
                        fullPaths: Readonly<['app', 'uploads']>;
                    }>;
                    settings: Readonly<{
                        children: Readonly<{
                            disabled: Readonly<{
                                children: {};
                                path: 'disabled';
                                fullPaths: Readonly<['app', 'settings', 'disabled']>;
                            }>;
                        }>;
                        path: 'settings';
                        fullPaths: Readonly<['app', 'settings']>;
                    }>;
                }>;
                path: 'app';
                fullPaths: Readonly<['app']>;
            }>;
            withAny: Readonly<{
                children: {};
                path: 'withAny';
                fullPaths: Readonly<['withAny']>;
            }>;
            legal: Readonly<{
                children: {};
                path: 'legal';
                fullPaths: Readonly<['legal']>;
            }>;
        }>;
        path: '';
        fullPaths: Readonly<[]>;
    }>;
    PathsType:
        | Readonly<[]>
        | Readonly<['app']>
        | Readonly<['app', 'uploads', 'patients']>
        | Readonly<['app', 'uploads', 'files']>
        | Readonly<['app', 'uploads', 'files', string]>
        | Readonly<['app', 'uploads', 'files', string, 'view']>
        | Readonly<['app', 'settings']>
        | Readonly<['app', 'settings', 'disabled']>
        | Readonly<['withAny', string]>
        | Readonly<['legal']>;
    sanitizePaths: {
        (
            rawPaths: readonly string[],
        ):
            | Readonly<[]>
            | Readonly<['app']>
            | Readonly<['app', 'uploads', 'patients']>
            | Readonly<['app', 'uploads', 'files']>
            | Readonly<['app', 'uploads', 'files', string]>
            | Readonly<['app', 'uploads', 'files', string, 'view']>
            | Readonly<['app', 'settings']>
            | Readonly<['app', 'settings', 'disabled']>
            | Readonly<['withAny', string]>
            | Readonly<['legal']>;
    };
};
