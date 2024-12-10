import { Page, expect, Locator } from "@playwright/test";
import { CommonMethods } from "../tests/commonMethods";
export default class AppointmentPage {
  readonly page: Page;
  public appointment: {
    appointmentLink: Locator;
    titleName: Locator;
    searchBar: Locator;
    patientName: Locator;
    hospitalSearchBar: Locator;
    patientCode: Locator;
  };

  constructor(page: Page) {
    this.page = page;
    this.appointment = {
      appointmentLink: page.locator('a[href="#/Appointment"]'),
      titleName: page.locator("//span[text() = 'Patient List |']"),
      searchBar: page.locator("#quickFilterInput"),
      hospitalSearchBar: page.locator("#id_input_search_using_hospital_no"),
      patientName: page.locator(
        "//div[@role='gridcell' and @col-id='ShortName'][1]"
      ),
      patientCode: page.locator(
        "//div[@role='gridcell' and @col-id='PatientCode'][1]"
      ),
    };
  }
  
  /**
   * @Test10 This method searches and verifies the patient list in the appointment section.
   *
   * @description This function navigates to the appointment page, waits for the patient list to load, and verifies
   *              the visibility of the first patient in the list. It then searches for the first patient's name in
   *              the search bar and checks if the results match the search term. The function repeats the process for
   *              the patient's hospital search code, ensuring that both the name and code are correctly matched in the
   *              search results. If all the checks pass, it returns true; otherwise, it returns false.
   * @return boolean - Returns true if the search and verification process is successful, otherwise false.
   */

  async searchAndVerifyPatientList(): Promise<boolean> {
    try {
      // Navigate to the appointment page
      await CommonMethods.highlightElement(this.appointment.appointmentLink);
      await this.appointment.appointmentLink.click();
      // Wait for the patient list page to be visible
      await CommonMethods.highlightElement(this.appointment.titleName);
      await this.appointment.titleName.isVisible();
      // Verify the first patient name
      await CommonMethods.highlightElement(
        this.appointment.patientName.first()
      );
      await expect(this.appointment.patientName.first()).toBeVisible();
      // Get the name of the first patient
      const searchName = await this.appointment.patientName.first().innerText();
      // Fill the search bar with the patient's name and press Enter
      await CommonMethods.highlightElement(this.appointment.searchBar);
      await this.appointment.searchBar.fill(searchName);
      await this.appointment.searchBar.press("Enter");
      // Wait for the results to load
      await this.page.waitForTimeout(3000);
      // Locate all patient names in the search results
      const patientNames = await this.page.locator(
        "//div[@role='gridcell' and @col-id='ShortName']"
      );
      // Verify that each patient's name in the result matches the search term
      const patientNamecount = await patientNames.count();
      const maxChecks = Math.min(patientNamecount, 20); // Limit checks to 20 results
      for (let i = 0; i < maxChecks; i++) {
        const name = await patientNames.nth(i).innerText();
        expect(name).toEqual(searchName);
      }
      // Get the name of the first patient
      const HospitalsearchCode = await this.appointment.patientCode
        .first()
        .innerText();
      // Fill the search bar with the patient's name and press Enter
      await CommonMethods.highlightElement(this.appointment.hospitalSearchBar);
      await this.appointment.hospitalSearchBar.fill(HospitalsearchCode);
      await this.appointment.hospitalSearchBar.press("Enter");
      // Wait for the results to load
      await this.page.waitForTimeout(3000);
      // Locate all patient names in the search results
      const patientCode = this.page.locator(
        "//div[@role='gridcell' and @col-id='PatientCode']"
      );
      // Verify that each patient's name in the result matches the search term
      const patientCodecount = await patientCode.count();
      const maxCheck = Math.min(patientCodecount, 20); // Limit checks to 20 results
      for (let i = 0; i < maxCheck; i++) {
        const code = await patientCode.nth(i).innerText();
        expect(code).toEqual(HospitalsearchCode);
      }
      // Return true if all assertions pass
      return true;
    } catch (error) {
      console.error(`Error in searchAndVerifyPatientList: ${error}`);
      return false;
    }
  }
}
