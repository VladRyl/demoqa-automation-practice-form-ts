import { test as base } from '@playwright/test';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { PracticeFormPage } from '../page-objects/practice-form.page';

type Fixtures = {
  practiceForm: PracticeFormPage;
  createTempFile: (filename: string) => Promise<string>;
};

export const test = base.extend<Fixtures>({
  practiceForm: async ({ page }, use) => {
    await use(new PracticeFormPage(page));
  },
  createTempFile: async ({}, use) => {
    const directories: string[] = [];
    await use(async (filename: string) => {
      const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'practice-form-'));
      directories.push(directory);
      const filePath = path.join(directory, filename);
      await fs.writeFile(filePath, 'test file');
      return filePath;
    });
    await Promise.all(directories.map((directory) => fs.rm(directory, { recursive: true, force: true })));
  },
});

export { expect } from '@playwright/test';
