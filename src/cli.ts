import {log} from '@augment-vir/common';
import {FlagRequirement, parseArgs} from 'cli-vir';
import {printTypeFromFile} from './print-type.js';

/**
 * Run the `print-type` packages's CLI.
 *
 * @category Main
 */
export function runPrintTypeCli(rawArgs: ReadonlyArray<string>, importMeta: ImportMeta) {
    try {
        const {filePath, symbolName, deep} = parseArgs(
            rawArgs,
            {
                filePath: {
                    position: 0,
                    required: true,
                },
                symbolName: {
                    position: 1,
                    required: true,
                },
                deep: {
                    flag: {
                        valueRequirement: FlagRequirement.Blocked,
                    },
                },
            },
            {
                binName: 'print-type',
                importMeta,
            },
        );

        const typeString = printTypeFromFile({filePath, symbolName, deep});

        console.info(typeString);
        process.exit(0);
    } catch (error) {
        log.error(error);
        process.exit(1);
    }
}
