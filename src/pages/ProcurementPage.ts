import { Locator, Page } from "playwright";
import { CommonMethods } from "../tests/commonMethods";

// import { error } from "console";

export default class ProcurementPage {
  readonly page: Page;
  private procurement: Locator;
  private purchaseRequest: Locator;
  private purchaseOrder: Locator;
  private goodsArrivalNotification: Locator;
  private quotations: Locator;
  private settings: Locator;
  private reports: Locator;
  private favoriteButton: Locator;
  private okButton: Locator;
  private printButton: Locator;
  private firstButton: Locator;
  private previousButton: Locator;
  private nextButton: Locator;
  private lastButton: Locator;
  private fromDate: Locator;
  private toDate: Locator;
  private invalidMsg: Locator;
  private requestedDateColumn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.procurement = page.locator('a[href="#/ProcurementMain"]');
    this.purchaseRequest = page.locator(
      `//a[contains(text(),"Purchase Request")]`
    );
    this.purchaseOrder = page.locator(
      `(//a[contains(text(),"Purchase Order")])[1]`
    );
    this.goodsArrivalNotification = page.locator(
      `//a[contains(text(),"Goods Arrival Notification")]`
    );
    this.quotations = page.locator(`//a[contains(text(),"Quotation")]`);
    this.settings = page.locator(`//a[contains(text(),"Settings")]`);
    this.reports = page.locator(`//a[contains(text(),"Reports")]`);
    this.favoriteButton = page.locator(
      `//i[contains(@class,"icon-favourite")]`
    );
    this.okButton = page.locator(`//button[contains(text(),"OK")]`);
    this.printButton = page.locator(`//button[text()='Print']`);
    this.firstButton = page.locator(`//button[text()='First']`);
    this.previousButton = page.locator(`//button[text()='Previous']`);
    this.nextButton = page.locator(`//button[text()='Next']`);
    this.lastButton = page.locator(`//button[text()='Last']`);
    this.fromDate = page.locator(`(//input[@id="date"])[1]`);
    this.toDate = page.locator(`(//input[@id="date"])[2]`);
    this.invalidMsg = page.locator(`//div[contains(@class,"invalid-msg-cal")]`);
    this.requestedDateColumn = page.locator(`div[col-id="RequestDate"]`);
  }

  /**
   * @Test4 This method verifies the visibility of essential elements in the Purchase Request List on the Procurement page.
   *
   * @description Navigates to the Procurement module and verifies the presence of multiple elements, including buttons
   *              and options related to the Purchase Request List. It highlights each element and checks if it is visible
   *              on the page. If any element is missing, the method returns false, and a warning is logged.
   * @return boolean - Returns true if all elements are visible; otherwise, returns false.
   */
  async verifyPurchaseRequestListElements(): Promise<boolean> {
    // Navigate to Procurement module
    await CommonMethods.highlightElement(this.procurement);
    await this.procurement.click();
    await this.page.waitForTimeout(2000);

    // Define the list of elements to verify visibility
    const elements = [
      this.purchaseRequest,
      this.purchaseOrder,
      this.goodsArrivalNotification,
      this.quotations,
      this.settings,
      this.reports,
      this.favoriteButton,
      this.okButton,
      this.printButton,
      this.firstButton,
      this.previousButton,
      this.nextButton,
      this.lastButton,
    ];

    // Loop through each element to verify its visibility
    for (const element of elements) {
      await CommonMethods.highlightElement(element);
      if (!(await element.isVisible())) {
        console.warn("Element not found on page:", await element.textContent());
        return false; // Return false if any element is not visible
      }
    }

    // Return true if all elements are present
    return true;
  }

  /**
   * @Test8 This method verifies the error message displayed after entering incorrect filter values.
   *
   * @description This method navigates to the Procurement module and attempts to apply
   *              an invalid date filter. After clicking the OK button, it captures the displayed
   *              error message, which indicates that the entered date is invalid.
   *
   * @return string - The trimmed error message displayed on the page after entering invalid filters.
   */
  async verifyNoticeMessageAfterEnteringIncorrectFilters(): Promise<string> {
    let actualErrorMessage = "";
    try {
      await CommonMethods.highlightElement(this.procurement);
      await this.procurement.click();

      await CommonMethods.highlightElement(this.purchaseRequest);
      await this.purchaseRequest.click();

      await CommonMethods.highlightElement(this.fromDate);
      await this.fromDate.type("00-00-0000", { delay: 100 });

      await CommonMethods.highlightElement(this.okButton);
      await this.okButton.click();

      actualErrorMessage = (await this.invalidMsg.textContent()) || "";
      console.log(
        `----------------------------Invalid Error Message --->> ${actualErrorMessage}----------------------------`
      );
    } catch (e) {
      throw new Error("Error message not found on page");
    }
    return actualErrorMessage.trim();
  }
}
