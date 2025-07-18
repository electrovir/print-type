import {findAncestor} from '@augment-vir/node';
import {existsSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {Node, Project, TypeFormatFlags, type Type} from 'ts-morph';

/**
 * Print the expanded type from a file path and a name within that file.
 *
 * @category Main
 */
export function printTypeFromFile(filePath: string, symbolName: string) {
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

    return printType(symbol.getType());
}

/**
 * Print an already extracted `Type` (extracted via the `ts-morph` package).
 *
 * @category Main
 */
export function printType(inputType: Type): string {
    return recursivelyPrintType(inputType);
}

function recursivelyPrintType(inputType: Type): string {
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
