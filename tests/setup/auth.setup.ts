import { test as setup, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

import { ENV, AUTH_STATE_PATH } from '../../src/config/env';
import { LoginPage } from '../../src/pages/LoginPage';

setup('authenticate as admin', async ({ page }) => {
  const authDir = path.dirname(AUTH_STATE_PATH);
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  const loginPage = new LoginPage(page);
  await loginPage.loginAsAdmin();
  await loginPage.expectUserToBeLoggedIn();

  expect(page.url()).not.toContain('login');
  expect(page.url()).toContain(ENV.BASE_URL);

  await page.context().storageState({ path: AUTH_STATE_PATH });
  console.warn(`Auth state saved to: ${AUTH_STATE_PATH}`);
});
