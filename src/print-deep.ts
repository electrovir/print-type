import {type Type as TsMorphType, SyntaxKind} from 'ts-morph';

/**
 * Print a type deeply, expanding everything that's reasonable to expand.
 *
 * Note: this function is entirely vibe coded.
 *
 * @category Internal
 */
export function printTypeDeep(type: TsMorphType): string {
    // Handle union types
    if (type.isUnion()) {
        const unionTypes = type.getUnionTypes();
        const expandedTypes = unionTypes.map((unionType) => printTypeDeep(unionType));

        // Clean up boolean union types to show as "boolean" instead of "false | true"
        if (
            expandedTypes.length === 2 &&
            expandedTypes.includes('true') &&
            expandedTypes.includes('false')
        ) {
            return 'boolean';
        }

        // Clean up optional types to remove "undefined" when it's clearly optional
        const filteredTypes = expandedTypes.filter((t) => t !== 'undefined');
        if (filteredTypes.length === 1 && expandedTypes.includes('undefined')) {
            return filteredTypes[0] || 'unknown';
        }

        return expandedTypes.join(' | ');
    }

    // Handle intersection types
    if (type.isIntersection()) {
        const intersectionTypes = type.getIntersectionTypes();
        const expandedTypes = intersectionTypes.map((intersectionType) =>
            printTypeDeep(intersectionType),
        );
        return expandedTypes.join(' & ');
    }

    // Handle array types
    if (type.isArray()) {
        const elementType = type.getArrayElementType();
        if (!elementType) {
            return 'unknown[]';
        }
        const elementTypeStr = printTypeDeep(elementType);

        // Check if this is a readonly array
        const typeText = type.getText();
        if (typeText.startsWith('readonly ')) {
            return `readonly ${elementTypeStr}[]`;
        }

        return `${elementTypeStr}[]`;
    }

    // Handle tuple types
    if (type.isTuple()) {
        const tupleElements = type.getTupleElements();
        const elementStrings = tupleElements.map((element) => printTypeDeep(element));

        const typeText = type.getText();
        const isReadonly = typeText.startsWith('readonly ') || typeText.includes('Readonly');
        const tupleContent = elementStrings.join(', ');

        if (isReadonly) {
            // Prefer wrapper form
            return `Readonly<[${tupleContent}]>`;
        }
        return `[${tupleContent}]`;
    }

    // Handle object types
    if (type.isObject()) {
        const symbol = type.getSymbol();

        // Check if this is a built-in type or class
        if (symbol) {
            const symbolName = symbol.getName();
            const isBuiltIn = isBuiltInTypeName(symbolName);

            // Handle Readonly wrapper
            if (symbolName === 'Readonly') {
                const typeArguments = type.getTypeArguments();
                if (typeArguments.length > 0) {
                    const innerType = typeArguments[0];
                    if (innerType && innerType.isObject()) {
                        // Force properties readonly but prefer wrapper without inline modifiers
                        const innerExpanded = expandObjectType(innerType, {
                            forceReadonlyProps: true,
                            stripReadonlyMarkers: true,
                            preferReadonlyWrapper: false,
                        });
                        return `Readonly<${innerExpanded}>`;
                    }
                }
            }

            // For built-in types, preserve type parameters but don't expand (with a few stylistic conversions)
            if (isBuiltIn) {
                const typeArguments = type.getTypeArguments();
                // normalize Array<T> and ReadonlyArray<T> into T[] and readonly T[] to match typical inline syntax
                if (symbolName === 'Array') {
                    const firstArg = typeArguments[0];
                    return firstArg ? `${printTypeDeep(firstArg)}[]` : 'unknown[]';
                }
                if (symbolName === 'ReadonlyArray') {
                    const firstArg = typeArguments[0];
                    return firstArg
                        ? `readonly ${printTypeDeep(firstArg)}[]`
                        : 'readonly unknown[]';
                }
                if (typeArguments.length > 0) {
                    const argStrings = typeArguments.map((arg) => printTypeDeep(arg));
                    return `${symbolName}<${argStrings.join(', ')}>`;
                }
                return symbolName;
            }
        }

        // For other object types (including classes), expand the literal structure
        return expandObjectType(type, {preferReadonlyWrapper: true});
    }

    // For literal types and primitives, use the text representation
    const typeText = type.getText();

    // Handle some common cases that might need cleanup
    if (typeText === 'true' || typeText === 'false') {
        return typeText;
    }

    if (typeText.match(/^\d+$/)) {
        return typeText;
    }

    if (typeText.startsWith('"') && typeText.endsWith('"')) {
        return typeText;
    }

    return typeText;
}

/** Expands a ts-morph object type to its literal string representation. */
function expandObjectType(
    type: TsMorphType,
    options: {
        forceReadonlyProps?: boolean;
        preferReadonlyWrapper?: boolean;
        stripReadonlyMarkers?: boolean;
    } = {},
): string {
    const properties = type.getProperties();
    const callSignatures = type.getCallSignatures();

    type PropMember = {text: string; readonly: boolean};
    const propMembers: PropMember[] = [];
    const callMembers: string[] = [];

    for (const prop of properties) {
        const propName = prop.getName();
        const isArrayMethod = [
            'length',
            'toString',
            'toLocaleString',
            'concat',
            'join',
            'slice',
            'indexOf',
            'lastIndexOf',
            'every',
            'some',
            'forEach',
            'map',
            'filter',
            'reduce',
            'reduceRight',
            'find',
            'findIndex',
            'entries',
            'keys',
            'values',
            'includes',
            'flatMap',
            'flat',
            'at',
            'findLast',
            'findLastIndex',
            'toReversed',
            'toSorted',
            'toSpliced',
            'with',
        ].includes(propName);

        const isSymbolProperty =
            propName.startsWith('__@') ||
            propName.includes('@iterator') ||
            propName.includes('@unscopables') ||
            propName.includes('@species') ||
            propName.includes('Symbol.');
        if (isArrayMethod || isSymbolProperty) {
            continue;
        }

        const declarations = prop.getDeclarations();
        if (declarations.length === 0) {
            const valueDecl = prop.getValueDeclaration();
            if (!valueDecl) {
                continue;
            }
            const propTypeFromValue = prop.getTypeAtLocation(valueDecl);
            const propTypeStr = printTypeDeep(propTypeFromValue);
            const needsQuotes = /(^[^a-zA-Z_$])|([^a-zA-Z0-9_$])/u.test(propName);
            const quotedPropName = needsQuotes ? `"${propName}"` : propName;
            const isOptional = prop.isOptional();
            const optionalMarker = isOptional ? '?' : '';
            const parentTypeText = type.getText();
            const readonlyPropertyRegex = new RegExp(
                `readonly\\s+(?:${quotedPropName}|${propName})(?:\\?|):`,
            );
            const isReadonly =
                readonlyPropertyRegex.test(parentTypeText) || !!options.forceReadonlyProps;
            propMembers.push({
                text: `${quotedPropName}${optionalMarker}: ${propTypeStr}`,
                readonly: isReadonly,
            });
            continue;
        }

        const firstDeclaration = declarations[0];
        if (!firstDeclaration) {
            continue;
        }
        const propType = prop.getTypeAtLocation(firstDeclaration);
        const propTypeStr = printTypeDeep(propType);
        const needsQuotes = /(^[^a-zA-Z_$])|([^a-zA-Z0-9_$])/u.test(propName);
        const quotedPropName = needsQuotes ? `"${propName}"` : propName;
        const isOptional = prop.isOptional();
        const optionalMarker = isOptional ? '?' : '';
        let isReadonly = false;
        for (const declaration of declarations) {
            if (
                'hasModifier' in declaration &&
                typeof (declaration as any).hasModifier === 'function' &&
                (declaration as any).hasModifier(SyntaxKind.ReadonlyKeyword)
            ) {
                isReadonly = true;
                break;
            }
            const declText = declaration.getText();
            if (/^\s*readonly\s+/.test(declText)) {
                isReadonly = true;
                break;
            }
        }
        if (!isReadonly) {
            const parentTypeText = type.getText();
            const readonlyPropertyRegex = new RegExp(
                `readonly\\s+(?:${quotedPropName}|${propName})(?:\\?|):`,
            );
            if (readonlyPropertyRegex.test(parentTypeText)) {
                isReadonly = true;
            }
        }
        if (!isReadonly && options.forceReadonlyProps) {
            isReadonly = true;
        }
        propMembers.push({
            text: `${quotedPropName}${optionalMarker}: ${propTypeStr}`,
            readonly: isReadonly,
        });
    }

    // Signatures
    for (const signature of callSignatures) {
        const params = signature.getParameters();
        const returnType = signature.getReturnType();
        const typeParameters = signature.getTypeParameters();
        const typeParamStrings = typeParameters.map((typeParam) => {
            const symbol = typeParam.getSymbol();
            const name = symbol ? symbol.getName() : typeParam.getText();
            const constraint = typeParam.getConstraint();
            const defaultType = typeParam.getDefault();
            let paramStr = name;
            if (constraint) {
                paramStr += ` extends ${printTypeDeep(constraint)}`;
            }
            if (defaultType) {
                paramStr += ` = ${printTypeDeep(defaultType)}`;
            }
            return paramStr;
        });
        const paramStrings = params.map((param) => {
            const paramName = param.getName();
            const declarations = param.getDeclarations();
            if (declarations.length === 0) {
                return `${paramName}: unknown`;
            }
            const firstDeclaration = declarations[0];
            if (!firstDeclaration) {
                return `${paramName}: unknown`;
            }
            const paramType = param.getTypeAtLocation(firstDeclaration);
            const paramTypeStr = printTypeDeep(paramType);
            const isOptional = param.isOptional();
            const optionalMarker = isOptional ? '?' : '';
            return `${paramName}${optionalMarker}: ${paramTypeStr}`;
        });
        const returnTypeStr = printTypeDeep(returnType);
        const typeParamSection = typeParamStrings.length ? `<${typeParamStrings.join(', ')}>` : '';
        callMembers.push(`${typeParamSection}(${paramStrings.join(', ')}): ${returnTypeStr}`);
    }

    if (propMembers.length === 0 && callMembers.length === 0) {
        return '{}';
    }

    // Determine if all props readonly for wrapper preference
    let allPropsReadonly = propMembers.length > 0 && propMembers.every((m) => m.readonly);

    // Heuristic for mapped types: if parent type text shows readonly before every property
    if (!allPropsReadonly && propMembers.length) {
        const parentTypeText = type.getText();
        const allAppearReadonly = propMembers.every((member) => {
            const rawNamePart = member.text.split(':')[0] || '';
            const qIndex = rawNamePart.indexOf('?');
            const propNamePart = qIndex >= 0 ? rawNamePart.slice(0, qIndex) : rawNamePart;
            if (!propNamePart) {
                return false;
            }
            // Basic word boundary-ish check without heavy regex backtracking risk
            const pattern = `readonly ${propNamePart}`;
            return parentTypeText.includes(pattern);
        });
        if (allAppearReadonly) {
            allPropsReadonly = true;
            for (const m of propMembers) {
                m.readonly = true;
            }
        }
    }

    if (options.preferReadonlyWrapper && allPropsReadonly && !options.stripReadonlyMarkers) {
        const innerMembers = [
            ...propMembers.map((m) => m.text),
            ...callMembers,
        ];
        return `Readonly<${formatObjectLiteral(innerMembers)}>`;
    }

    const finalMembers: string[] = [
        ...propMembers.map((m) => {
            if (m.readonly && !options.stripReadonlyMarkers) {
                return `readonly ${m.text}`;
            }
            return m.text;
        }),
        ...callMembers,
    ];
    return formatObjectLiteral(finalMembers);
}

/** Checks if a symbol name represents a built-in type. */
function isBuiltInTypeName(name: string): boolean {
    const builtInTypes = [
        'Array',
        'ReadonlyArray',
        'Map',
        'Set',
        'Date',
        'RegExp',
        'Error',
        'Promise',
        'WeakMap',
        'WeakSet',
        'ArrayBuffer',
        'DataView',
        'Int8Array',
        'Uint8Array',
        'Uint8ClampedArray',
        'Int16Array',
        'Uint16Array',
        'Int32Array',
        'Uint32Array',
        'Float32Array',
        'Float64Array',
        'BigInt64Array',
        'BigUint64Array',
        'Readonly',
    ];

    return builtInTypes.includes(name);
}

/** Formats object literal members with proper indentation and structure. */
function formatObjectLiteral(
    members: string[],
    readonlyPrefix: string = '',
    readonlySuffix: string = '',
    depth: number = 0,
): string {
    if (members.length === 0) {
        return '{}';
    }

    const indent = '    '.repeat(depth + 1);
    const closeIndent = '    '.repeat(depth);

    // Process each member and handle nested objects
    const formattedMembers = members.map((member) => {
        // Check if this member contains a nested object
        if (member.includes('{\n')) {
            // This is a nested object, increase indentation
            const colonIndex = member.indexOf(': ');
            if (colonIndex !== -1) {
                const propPart = member.slice(0, Math.max(0, colonIndex));
                const valuePart = member.slice(Math.max(0, colonIndex + 2));
                const indentedValue = valuePart
                    .split('\n')
                    .map((line, index) => {
                        if (index === 0) {
                            return line;
                        } // First line doesn't need extra indent
                        return '    ' + line; // Add extra indentation to nested lines
                    })
                    .join('\n');
                return `${indent}${propPart}: ${indentedValue}`;
            }
        }
        return `${indent}${member}`;
    });

    return `${readonlyPrefix}{\n${formattedMembers.join(';\n')};\n${closeIndent}}${readonlySuffix}`;
}
