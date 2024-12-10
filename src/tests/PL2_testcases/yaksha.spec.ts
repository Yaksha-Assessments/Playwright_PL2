import { expect, test } from "playwright/test";
import AppointmentPage from "../../pages/AppointmentPage";
import UtilitiesPage from "../../pages/UtilitiesPage";
import DispensaryPage from "../../pages/DispensaryPage";
import { LoginPage } from "../../pages/LoginPage";
import ProcurementPage from "../../pages/ProcurementPage";
import PatientPage from "../../pages/PatientPage";
import RadiologyPage from "../../pages/RadiologyPage";
import LaboratoryPage from "../../pages/LaboratoryPage";
import BillingPage from "../../pages/BillingPage";
import ClaimManagementPage from "src/pages/ClaimManagementPage";
import path from "path";
import { CommonMethods } from "../commonMethods";
import SettingsPage from "src/pages/SettingsPage";

test.describe("Yaksha", () => {
  let appointmentPage: AppointmentPage;
  let utilitiesPage: UtilitiesPage;
  let dispensaryPage: DispensaryPage;
  let procurementPage: ProcurementPage;
  let loginPage: LoginPage;
  let patientPage: PatientPage;
  let radiologyPage: RadiologyPage;
  let laboratoryPage: LaboratoryPage;
  let context;
  let billingPage: BillingPage;
  let claimManagementPage: ClaimManagementPage;
  let settingsPage: SettingsPage;


  test.beforeAll(async ({ browser: b }) => {
    context = await b.newContext();
    const page = await context.newPage();
    loginPage = new LoginPage(page);
    utilitiesPage = new UtilitiesPage(page);
    appointmentPage = new AppointmentPage(page);
    dispensaryPage = new DispensaryPage(page);
    procurementPage = new ProcurementPage(page);
    patientPage = new PatientPage(page);
    radiologyPage = new RadiologyPage(page);
    laboratoryPage = new LaboratoryPage(page);
    billingPage = new BillingPage(page);
    claimManagementPage = new ClaimManagementPage(page);
    settingsPage = new SettingsPage(page);

    await page.goto("/");
  });

  let filePath = path.join(__dirname, "..", "..", "Data", "Result.xlsx");

  test.describe("boundary", () => {
    test("Login with valid credentials from Excel", async () => {
      const loginData = await CommonMethods.readExcel(filePath, "Login");
      expect(await loginPage.performLogin(loginData)).toBeTruthy();
    });
  });

  test("TS-2 Verify Page Navigation and Load Time for Billing Counter ", async () => {
    expect(await utilitiesPage.verifyBillingCounterLoadState()).toBeTruthy();
  });

  test("TS-3 Activate Counter in Dispensar", async () => {
    expect(
      await dispensaryPage.verifyActiveCounterMessageInDispensary()
    ).toBeTruthy();
  });

  test("TS-4 Purchase Request List Load", async () => {
    expect(
      await procurementPage.verifyPurchaseRequestListElements()
    ).toBeTruthy();
  });

  test("TS-5 Verify error message while adding new lab test in Laboratory", async () => {
    expect(await laboratoryPage.verifyErrorMessage()).toEqual(
      "Lab Test Code Required."
    );
  });

  test("TS-6 Handle Alert on Radiology Module", async () => {
    const data = await CommonMethods.readExcel(filePath, "DateRange");
    expect(
      await radiologyPage.performRadiologyRequestAndHandleAlert(data)
    ).toBeTruthy();
  });

  test("TS-7 Data-Driven Testing for Patient Search", async () => {
    const patientData = await CommonMethods.readExcel(filePath, "PatientNames");
    expect(await patientPage.searchAndVerifyPatients(patientData)).toBeTruthy();
  });

  test("TS-8 Error Handling and Logging in Purchase Request List", async () => {
    expect(
      await procurementPage.verifyNoticeMessageAfterEnteringIncorrectFilters()
    ).toEqual("Date is not between Range. Please enter again");
  });


  test("TS-9 Verify Assertion for Counter Activation", async () => {
    expect.soft(await dispensaryPage.verifyCounterisActivated()).toBeTruthy();
  });

  test("TS-10 Verify Locator Strategy for Appointment Search ", async () => {
    expect(await appointmentPage.searchAndVerifyPatientList()).toBeTruthy();
  });

  test("TS-11 Assertions are defined for required fields (e.g., Username,Password) and optional fields(e.g., Remember Me).", async () => {
    const loginData = await CommonMethods.readExcel(filePath, "Login");
    expect(await loginPage.verifyThePresenceOfLoginFields(loginData)).toBeTruthy();
  });

  test("TS-12 Switching Between Pages & Windows", async () => {
    expect(await claimManagementPage.verifyWindowNavigation()).toBeTruthy();
  });

  test("TS-13 LocatorStrategies withXPath &CSS", async () => {
    const data = await CommonMethods.readExcel(filePath, "DateRange");
    expect(await dispensaryPage.verfiySearchfunctionality(data)).toBeTruthy();
  });

  test("TS-14 Manage web element interactions", async () => {
    expect(await billingPage.verifyBillDetails()).toBeTruthy();
  });

  test("TS-15 Implement WaitStrategies", async () => {
    const data = await CommonMethods.readExcel(filePath, "DateRange");
    expect(await claimManagementPage.verifyBillReview(data)).toBeTruthy();
  });

  test("TS-16 Verify Add/Remove Departments", async () => {
    const data = await CommonMethods.readExcel(filePath, "AddDepartment");
    expect(await settingsPage.verifyAddAndEditDepartment(data)).toEqual(
      "Department Updated"
    );
  });

});
