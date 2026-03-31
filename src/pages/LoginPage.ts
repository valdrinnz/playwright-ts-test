import { type Locator, type Page, expect } from '@playwright/test';

import { ENV } from '../config/env';

const LOGIN_URL = `${ENV.BASE_URL}/demo/api/kic/da/auth.html#/`;

export class LoginPage {
  constructor(private readonly page: Page) {}

  get usernameInput(): Locator {
    return this.page.getByTestId('LoginView.username-text-field');
  }

  get passwordInput(): Locator {
    return this.page.getByTestId('PasswordTextField.password-text-field');
  }

  get loginButton(): Locator {
    return this.page.getByTestId('LoginView.login-button');
  }

  get userMenu(): Locator {
    return this.page.getByTestId('NavItems.CurrentUser.Name');
  }

  async navigateToLoginURL(): Promise<void> {
    await this.page.goto(LOGIN_URL);
  }

  async login(username: string, password: string): Promise<void> {
    await this.navigateToLoginURL();

    if (await this.userMenu.isVisible()) {
      return;
    }

    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();

    await this.userMenu.waitFor({ state: 'visible' });
  }

  async loginAsAdmin(): Promise<void> {
    await this.login(ENV.ADMIN_USERNAME, ENV.ADMIN_PASSWORD);
  }

  async expectUserToBeLoggedIn(): Promise<void> {
    await expect(this.userMenu).toBeVisible({ timeout: 10_000 });
  }
}
