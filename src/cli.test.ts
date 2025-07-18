import {assert} from '@augment-vir/assert';
import {log, mapObjectValues, pickObjectKeys} from '@augment-vir/common';
import {describe, snapshotCases} from '@augment-vir/test';
import {runPackageCli} from 'test-as-package';
import {repoDirPath, testFilePaths} from './file-paths.mock.js';

async function testCli(shouldPass: boolean, args: ReadonlyArray<string>) {
    const output = await runPackageCli({
        commandArgs: args,
        cwd: repoDirPath,
        hookUpToConsole: true,
    });

    assert.isTrue(shouldPass ? output.exitCode === 0 : output.exitCode !== 0);

    log.error(output.stderr);

    return mapObjectValues(
        pickObjectKeys(output, [
            'exitCode',
            'stdout',
            'stderr',
        ]),
        (key, value) => {
            if (typeof value === 'string') {
                return value.replaceAll(repoDirPath, '');
            } else {
                return value;
            }
        },
    );
}

describe('print-type package', () => {
    snapshotCases(testCli, [
        {
            it: 'handles a missing file',
            inputs: [
                false,
                [
                    'invalid-file-paths.ts',
                    'MissingTypeName',
                ],
            ],
        },
        {
            it: 'handles a missing type alias',
            inputs: [
                false,
                [
                    testFilePaths.hasNoTypes,
                    'MissingTypeName',
                ],
            ],
        },
        {
            it: 'handles a value',
            inputs: [
                true,
                [
                    testFilePaths.hasNoTypes,
                    'valueOnly',
                ],
            ],
        },
        {
            it: 'handles a complex type',
            inputs: [
                true,
                [
                    testFilePaths.allTheTypes,
                    'ComplexType',
                ],
            ],
        },
    ]);
});
