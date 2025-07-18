import {join, resolve} from 'node:path';

export const repoDirPath = resolve(import.meta.dirname, '..');
export const testFilesDirPath = join(repoDirPath, 'test-files');
export const testFilePaths = {
    hasNoTypes: join(testFilesDirPath, 'has-no-types.ts'),
    allTheTypes: join(testFilesDirPath, 'all-the-types.ts'),
};
