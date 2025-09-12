/** Run this script to manually test the output of deep type printing. */
import {log} from '@augment-vir/common';
import {writeFile} from 'node:fs/promises';
import {join, relative} from 'node:path';
import {repoDirPath, testInputFilesDirPath, testOutputFilesDirPath} from './file-paths.mock.js';
import {printTypeFromFile} from './print-type.js';

const result =
    'export type Output = ' +
    printTypeFromFile({
        symbolName: 'mockPathTree',
        filePath: join(testInputFilesDirPath, 'path-tree.ts'),
        deep: true,
    });

const outputFilePath = join(testOutputFilesDirPath, 'path-tree.ts');
await writeFile(outputFilePath, result);

log.info(`output printed to ${relative(repoDirPath, outputFilePath)}`);
