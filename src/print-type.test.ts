import {describe, snapshotCases} from '@augment-vir/test';
import {testFilePaths} from './file-paths.mock.js';
import {printTypeFromFile} from './print-type.js';

describe(printTypeFromFile.name, () => {
    snapshotCases(printTypeFromFile, [
        {
            it: 'prints crazy deep',
            input: {
                filePath: testFilePaths.allTheTypes,
                symbolName: 'mockPathTree',
                deep: true,
            },
        },
    ]);
});
