import {type PartialWithUndefined} from '@augment-vir/common';
import {findAncestor} from '@augment-vir/node';
import {existsSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {Node, Project, TypeFormatFlags, type Type} from 'ts-morph';
import {printTypeDeep} from './print-deep.js';

/**
 * Params for {@link printTypeFromFile}.
 *
 * @category Internal
 */
export type PrintTypeFromFileParams = {
    filePath: string;
    symbolName: string;
} & PrintTypeOptions;

/**
 * Print the expanded type from a file path and a name within that file.
 *
 * @category API
 */
export function printTypeFromFile({
    filePath,
    symbolName,
    ...options
}: Readonly<PrintTypeFromFileParams>): string {
    if (!existsSync(filePath)) {
        throw new Error(`Failed to find file: '${filePath}'`);
    }

    const tsconfigDirPath = findAncestor(dirname(filePath), (path) => {
        return existsSync(join(path, 'tsconfig.json'));
    });

    if (!tsconfigDirPath) {
        throw new Error(`Failed to find any tsconfig.json parent of '${filePath}'`);
    }

    const project = new Project({
        tsConfigFilePath: join(tsconfigDirPath, 'tsconfig.json'),
    });

    // Add the file to the project if it's not already included (e.g., if it's excluded in tsconfig)
    const sourceFile = project.getSourceFile(filePath) || project.addSourceFileAtPath(filePath);

    const symbol =
        sourceFile.getVariableDeclaration(symbolName) ||
        sourceFile.getInterface(symbolName) ||
        sourceFile.getTypeAlias(symbolName) ||
        sourceFile.getClass(symbolName) ||
        sourceFile.getFunction(symbolName) ||
        sourceFile.getEnum(symbolName);

    if (!symbol) {
        throw new Error(`Failed to find '${symbolName}' in '${filePath}'.`);
    }

    return printType(symbol.getType(), options);
}

/**
 * Options for `printType`.
 *
 * @category Internal
 */
export type PrintTypeOptions = PartialWithUndefined<{
    /**
     * Take much longer to print much more output with lots of potential for it all to go wrong.
     *
     * @default false
     */
    deep: boolean;
}>;

/**
 * Print an already extracted `Type` (extracted via the `ts-morph` package).
 *
 * @category Internal
 */
export function printType(inputType: Type, options: Readonly<PrintTypeOptions> = {}): string {
    if (options.deep) {
        return printTypeDeep(inputType);
    } else {
        const symbol = inputType.getAliasSymbol();
        if (symbol) {
            const declaration = symbol.getDeclarations()[0];
            if (declaration && Node.isTypeAliasDeclaration(declaration)) {
                return declaration.getTypeNodeOrThrow().getText();
            }
        }
        const text = inputType.getText(
            undefined,
            TypeFormatFlags.UseTypeOfFunction |
                TypeFormatFlags.NoTruncation |
                TypeFormatFlags.UseFullyQualifiedType |
                TypeFormatFlags.WriteArrowStyleSignature |
                TypeFormatFlags.WriteTypeArgumentsOfSignature |
                TypeFormatFlags.UseSingleQuotesForStringLiteralType |
                TypeFormatFlags.UseAliasDefinedOutsideCurrentScope |
                TypeFormatFlags.AllowUniqueESSymbolType,
        );

        return text.replace(/import\(".*?"\)\./g, '');
    }
}
