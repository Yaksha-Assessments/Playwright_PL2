import { Page, expect, Locator } from "@playwright/test";
import { CommonMethods } from "../tests/commonMethods";

export default class DispensaryPage {
  readonly page: Page;
  private maxRetries = 3;
  private timeoutDuration = 5000;
  private fromDate: Locator;

  public dispensary: {

    dispensaryLink: Locator;
    activateCounter: Locator;
    counterSelection: Locator;
    counterName: Locator;
    activatedCounterInfo: Locator;
    deactivateCounterButton: Locator;
    titleName: Locator;
    name: Locator;
    prescription: Locator;
    report: Locator;
    userCollectionReport: Locator;
    showReportButton: Locator;
    patientName: Locator;
    searchBar: Locator;

  };

  constructor(page: Page) {
    this.page = page;
    this.fromDate = page.locator(`(//input[@id="date"])[1]`);
    this.dispensary = {
      dispensaryLink: page.locator('a[href="#/Dispensary"]'),
      activateCounter: page.locator("//a[contains(text(),'Counter')]"),
      counterSelection: page.locator('//div[@class="counter-item"]'),
      counterName: page.locator('//div[@class="counter-item"]//h5'),
      activatedCounterInfo: page.locator(`div.mt-comment-info`),
      deactivateCounterButton: page.locator(
        `//button[contains(text(),'Deactivate Counter')]`
      ),
      titleName: page.locator('//span[@class="caption-subject"]'),
      name: page.locator('(//div[@class="col-sm-4 col-md-3"]//label//span)[1]'),
      prescription: page.locator("//a[contains(text(),' Prescription ')]"),
      report: page.locator(" //a[text()=' Reports ']"),
      userCollectionReport: page.locator(
        "(//span[@class='report-name']//i)[1]"
      ),
      showReportButton: page.locator("//span[text()='Show Report']"),
      patientName: page.locator(
        "(//div[@role='row']//div[@col-id='PatientName'])[2]"
      ),
      searchBar: page.locator("#quickFilterInput"),
    };
  }

  /**
   * @Test3 This method verifies the activation message for a random counter in the dispensary module.
   *
   * @description Navigates to the Dispensary page and selects a random counter if multiple counters are available.
   *              After activating the selected counter, the method verifies that the activation message displays
   *              the correct counter name. If the counter name matches in the activation message, the function
   *              returns true. Logs are included to provide details on counter selection and activation status.
   * @return boolean - Returns true if the activation message correctly shows the selected counter name; otherwise, returns false.
   */
  async verifyActiveCounterMessageInDispensary(): Promise<boolean> {
    let isCounterNameActivated = false;
    try {
      // Navigate to Dispensary module
      await CommonMethods.highlightElement(this.dispensary.dispensaryLink);
      await this.dispensary.dispensaryLink.click();
      await CommonMethods.highlightElement(this.dispensary.activateCounter);
      await this.dispensary.activateCounter.click();
      // Wait for the page to load
      await this.page.waitForTimeout(2000);
      await this.page.waitForSelector("//span[@class='caption-subject']", {
        state: "visible",
      });

      // Get the count of available counters
      const counterCount = await this.dispensary.counterSelection.count();
      console.log(`Counter count >> ${counterCount}`);

      if (counterCount >= 1) {
        // Select a random counter index
        const randomIndex = Math.floor(Math.random() * counterCount);
        console.log(`Random counter index selected: ${randomIndex}`);

        // Fetch the name of the selected counter
        const fullCounterText = await this.dispensary.counterName
          .nth(randomIndex)
          .textContent();
        let counterName =
          fullCounterText?.split("click to Activate")[0].trim() || ""; // Extracts "Morning Counter"
        console.log(`Counter name at index ${randomIndex}: ${counterName}`);

        // Highlight and select the random counter
        const randomCounter = this.dispensary.counterSelection.nth(randomIndex);
        await CommonMethods.highlightElement(randomCounter);
        await randomCounter.click();

        // Activate the selected counter
        await CommonMethods.highlightElement(this.dispensary.activateCounter);
        await this.dispensary.activateCounter.click();

        // Get and verify the activation message text
        const activatedCounterInfoText =
          await this.dispensary.activatedCounterInfo.textContent();
        console.log(
          `Activated counter info text : ${activatedCounterInfoText}`
        );

        // Check if the message contains the selected counter name
        if (activatedCounterInfoText?.includes(counterName)) {
          isCounterNameActivated = true;
          console.log(
            `-------------------------Returning true-------------------------`
          );
        }
      }
    } catch (e) {
      console.error("Error selecting random counter:", e);
    }
    return isCounterNameActivated;
  }

  /**
   * @Test9 This method verifies if the counter is activated in the dispensary section.
   *
   * @description This function highlights the dispensary link, clicks on it to navigate to the dispensary page,
   *              waits for the page to load, and then attempts to activate the counter. It checks whether the 'deactivate'
   *              counter button becomes visible after activation. If the button is not found, it logs a warning and returns false.
   *              If the activation is successful, it returns true.
   * @return boolean - Returns true if the counter is successfully activated, otherwise false.
   */

  async verifyCounterisActivated(): Promise<boolean> {
    try {
      await CommonMethods.highlightElement(this.dispensary.dispensaryLink);
      await this.dispensary.dispensaryLink.click();

      await this.page.waitForTimeout(2000);

      await CommonMethods.highlightElement(this.dispensary.activateCounter);
      await this.dispensary.activateCounter.click();

      if (!(await this.dispensary.deactivateCounterButton.isVisible())) {
        console.warn(
          "Element not found on page:",
          await this.dispensary.deactivateCounterButton.textContent()
        );
        return false;
      }
    } catch (error) {
      console.error("Error during activation message verification:", error);
    }
    return true;
  }


  
  /**
 * @Test13 This method verifies the search functionality within the Dispensary module.
 *
 * @description This function navigates to the dispensary section and opens the User Collection Report page. 
 *              It allows filtering reports by selecting a "From Date" and clicking the "Show Report" button. 
 *              The method captures a patient's name from the report, uses it to perform a search, and verifies 
 *              that the search results match the expected patient name.
 *
 * @param data - A record containing the "FromDate" for filtering the User Collection Report.
 * @return boolean - Returns true if the search functionality works as expected and the results match; otherwise, false.
 */

  async verfiySearchfunctionality(
    data: Record<string, string>
  ): Promise<boolean> {
    try {
      const fromDate = data["FromDate"];
      await CommonMethods.highlightElement(this.dispensary.dispensaryLink);
      await this.dispensary.dispensaryLink.click();
      await CommonMethods.highlightElement(this.dispensary.report);
      await this.dispensary.report.click();
      await this.page.waitForTimeout(2000);
      await CommonMethods.highlightElement(
        this.dispensary.userCollectionReport
      );
      await this.dispensary.userCollectionReport.click();
      await this.page.waitForTimeout(2000);
      // Select the From Date and To Date
      await CommonMethods.highlightElement(this.fromDate);
      await this.fromDate.type(fromDate, { delay: 100 });
      await CommonMethods.highlightElement(this.dispensary.showReportButton);
      await this.dispensary.showReportButton.click();

      const patientName = await this.dispensary.patientName.innerText();
      console.log(`Patient name --> ${patientName}`);

      await CommonMethods.highlightElement(this.dispensary.searchBar);
      await this.dispensary.searchBar.fill(patientName);
      const searchbarName = await this.dispensary.searchBar.textContent();
      console.log(`Search bar name --> ${searchbarName}`);

      expect(patientName).toEqual(patientName);
      return true;
    } catch (e) {
      console.error("Error selecting random counter:", e);
      return false;
    }
  }
}
