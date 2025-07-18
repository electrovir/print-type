import {extractRelevantArgs} from '@augment-vir/node';
import {printTypeFromFile} from './print-type.js';

/**
 * Run the `print-type` packages's CLI.
 *
 * @category Main
 */
export function runPrintTypeCli(rawArgs: ReadonlyArray<string>, importMeta: ImportMeta) {
    try {
        const relevantArgs = extractRelevantArgs({
            binName: 'print-type',
            fileName: importMeta.filename,
            rawArgs,
        });

        const filePath = relevantArgs[0];
        const typeName = relevantArgs[1];

        if (!filePath) {
            throw new Error('Missing file path argument (should be first).');
        } else if (!typeName) {
            throw new Error('Missing type alias name argument (should be second).');
        }

        const typeString = printTypeFromFile(filePath, typeName);

        console.info(typeString);
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}
