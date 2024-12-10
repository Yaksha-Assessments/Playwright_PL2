import { Locator, Page } from "@playwright/test";
import { CommonMethods } from "../tests/commonMethods";

export class LoginPage {
  readonly page: Page;
  private usernameInput: Locator;
  private passwordInput: Locator;
  private loginButton: Locator;
  private loginErrorMessage: Locator;
  private admin: Locator;
  private logOut: Locator;
  private rememberMeCheckbox: Locator;


  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator(`#username_id`);
    this.passwordInput = page.locator(`#password`);
    this.loginButton = page.locator(`#login`);
    this.loginErrorMessage = page.locator(
      `//div[contains(text(),"Invalid credentials !")]`
    );
    this.admin = page.locator('//li[@class="dropdown dropdown-user"]');
    this.logOut = page.locator("//a[text() = ' Log Out ']");
    this.rememberMeCheckbox = page.locator(`#RememberMe`);

  }

  async navigate() {
    await this.page.goto("/");
  }

  /**
   * @Test1 This method logs in the user with valid credentials.
   *
   * @param username - The username used for login.
   * @param password - The password used for login.
   * @description Attempts to log in using the provided username and password. Highlights input fields
   *              during interaction and checks for successful login by verifying the visibility of the
   *              'admin' element post-login.
   * @return boolean - Returns true if login is successful, otherwise false.
   */

  async performLogin(loginData: Record<string, string>): Promise<boolean> {
    let isUserLoggedIn = false;

    try {
      // Highlight and fill the username field
      await CommonMethods.highlightElement(this.usernameInput);
      await this.usernameInput.fill(loginData['ValidUserName']);

      // Highlight and fill the password field
      await CommonMethods.highlightElement(this.passwordInput);
      await this.passwordInput.fill(loginData['ValidPassword']);

      // Highlight and click the login button
      await CommonMethods.highlightElement(this.loginButton);
      await this.loginButton.click();

      // Verify successful login by checking if 'admin' element is visible
      await this.admin.waitFor({ state: "visible", timeout: 20000 });
      isUserLoggedIn = await this.admin.isVisible();
    } catch (e) {
      console.error("Error during login:", e);
    }

    return isUserLoggedIn;
  }


  
/**
 * @Test11 This method verifies the presence of login fields and attempts to log in if the fields are visible.
 *
 * @description This function checks if the username, password, and "Remember Me" checkbox are present on the login page. 
 *              If the user is already logged in, it first logs the user out to reset the login state. Once the login fields 
 *              are verified, it performs a login operation using the provided login data. The function returns true if the 
 *              login is successful, otherwise false.
 *
 * @param loginData Record<string, string> - An object containing login credentials such as username and password.
 * 
 * @return Promise<boolean> - Returns true if the user successfully logs in after verifying the presence of the login fields, 
 *                            otherwise false.
 */
async verifyThePresenceOfLoginFields(loginData: Record<string, string>): Promise<boolean> {
  let isUserLoggedIn: boolean = false;
  try {
    await this.page.waitForTimeout(2000);

    // Attempt to reset login state by logging out if logged in
    if (await this.admin.isVisible()) {
      await CommonMethods.highlightElement(this.admin);
      await this.admin.click();

      await CommonMethods.highlightElement(this.logOut);
      await this.logOut.click();
    }
    if (await this.usernameInput.isVisible() && await this.passwordInput.isVisible() && await this.rememberMeCheckbox.isVisible()) {
      await this.performLogin(loginData);
      isUserLoggedIn = true;
    }
  } catch (e) {
    console.error("Error during login field verification:", e);
  }
  return isUserLoggedIn;
}

}
