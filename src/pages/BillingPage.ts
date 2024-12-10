import { Page, expect, Locator } from "@playwright/test";
import { CommonMethods } from "../tests/commonMethods";

export default class DispensaryPage {
  readonly page: Page;
  public billing: {
    billingModule: Locator;
    returnBills: Locator;
    fiscalYearDropdown: Locator;
    searchButton: Locator;
    invoiceNumberField: Locator;
    speceficYearOption: Locator;
    counterItem: Locator;
    tableData: Locator;
    counter: Locator;
  };

  constructor(page: Page) {
    this.page = page;
    this.billing = {
      billingModule: page.locator("(//span[text() = 'Billing'])[1]"),
      returnBills: page.locator("//a[text()='Return Bills ']"),
      fiscalYearDropdown: page.locator("//div[@class='search-list']//select"),
      searchButton: page.locator("//div[@class='search-list']//button"),
      invoiceNumberField: page.locator('//div[@class="search-list"]//input'),
      speceficYearOption: page.locator("//option[text()= ' 2024 ']"),
      counterItem: page.locator("//div[@class='counter-item']"),
      tableData: page.locator("(//div[@class='col-md-12']//tbody//tr)[2]"),
      counter: page.locator(`(//div[@class="counter-item"])[1]`),
    };
  }

  /**
 * @Test14
 * Verifies billing details by searching for a specific invoice in the Billing module.
 * 
 * Steps performed:
 * 1. Navigates to the Billing module by clicking on the Billing module link.
 * 2. Selects the counter for managing billing operations.
 * 3. Accesses the "Return Bills" section.
 * 4. Filters the bills by selecting the fiscal year and entering an invoice number.
 * 5. Initiates the search for the specified invoice and validates the search results.
 * 6. Ensures that the search results table contains at least one entry.
 * 
 * @returns {Promise<boolean>} `true` if billing details are successfully verified, `false` otherwise.
 * 
 * @throws Logs an error message if there is an issue during the verification process.
 */
  async verifyBillDetails(): Promise<boolean> {
    try {
      await CommonMethods.highlightElement(this.billing.billingModule);
      await this.billing.billingModule.click();
      await this.page.waitForTimeout(2000);

      await this.billing.counter.click();

      await CommonMethods.highlightElement(this.billing.returnBills);
      await this.billing.returnBills.click();
      await this.page.waitForTimeout(2000);
      await CommonMethods.highlightElement(this.billing.fiscalYearDropdown);
      await this.billing.fiscalYearDropdown.selectOption("2024");
      await this.page.waitForTimeout(2000);
      await CommonMethods.highlightElement(this.billing.invoiceNumberField);
      await this.billing.invoiceNumberField.fill("95");
      await this.page.waitForTimeout(1000);
      await CommonMethods.highlightElement(this.billing.searchButton);
      await this.billing.searchButton.click();
      await this.page.waitForTimeout(1000);
      const count = await this.billing.tableData.count();
      expect(count).toBeGreaterThan(0);
      return true;
    } catch (error) {
      console.error("Error searching and verifying patients:", error);
      return false;
    }
  }
}
