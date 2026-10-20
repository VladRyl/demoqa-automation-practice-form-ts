import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { Gender, Hobby, ValidationState } from '../enums/enums';

export class PracticeFormPage extends BasePage {
  readonly mainHeader: Locator;
  readonly studentRegistrationForm: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly userEmailInput: Locator;
  readonly genderWrapper: Locator;
  readonly mobileNumberInput: Locator;
  readonly dateOfBirthInput: Locator;
  readonly subjectsInput: Locator;
  readonly hobbiesWrapper: Locator;
  readonly uploadPictureInput: Locator;
  readonly currentAddressInput: Locator;
  readonly stateSelect: Locator;
  readonly citySelect: Locator;
  readonly submitButton: Locator;
  readonly modalContent: Locator;
  readonly modalTitle: Locator;
  readonly modalTable: Locator;
  readonly closeModalButton: Locator;

  constructor(page: Page) {
    super(page);
    this.mainHeader = page.locator('.container.playgound-body h1');
    this.studentRegistrationForm = page.locator('.container.playgound-body h5');
    this.firstNameInput = page.locator('#firstName');
    this.lastNameInput = page.locator('#lastName');
    this.userEmailInput = page.locator('#userEmail');
    this.genderWrapper = page.locator('#genterWrapper');
    this.mobileNumberInput = page.locator('#userNumber');
    this.dateOfBirthInput = page.locator('#dateOfBirthInput');
    this.subjectsInput = page.locator('#subjectsInput');
    this.hobbiesWrapper = page.locator('#hobbiesWrapper');
    this.uploadPictureInput = page.locator('#uploadPicture');
    this.currentAddressInput = page.locator('#currentAddress');
    this.stateSelect = page.locator('#state');
    this.citySelect = page.locator('#city');
    this.submitButton = page.locator('#submit');
    this.modalContent = page.locator('.modal-content');
    this.modalTitle = this.modalContent.locator('#example-modal-sizes-title-lg');
    this.modalTable = this.modalContent.locator('table');
    this.closeModalButton = this.modalContent.locator('#closeLargeModal');
  }

  async open(): Promise<void> {
    await this.navigateTo('/automation-practice-form');
    await expect(this.mainHeader).toBeVisible();
  }

  async verifyPageLoaded(): Promise<void> {
    await expect(this.mainHeader).toHaveText('Practice Form');
  }

  async verifyStudentRegistrationFormVisible(): Promise<void> {
    await expect(this.studentRegistrationForm).toBeVisible();
    await expect(this.studentRegistrationForm).toHaveText('Student Registration Form');
  }

  async fillFirstName(firstName: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
  }

  async fillLastName(lastName: string): Promise<void> {
    await this.lastNameInput.fill(lastName);
  }

  async fillEmail(email: string): Promise<void> {
    await this.userEmailInput.fill(email);
  }

  async selectGender(gender: Gender): Promise<void> {
    await this.genderWrapper.getByText(gender, { exact: true }).click();
  }

  async fillMobileNumber(mobileNumber: string): Promise<void> {
    await this.mobileNumberInput.fill(mobileNumber);
  }

  async fillRequiredFields(gender: Gender = Gender.Male): Promise<void> {
    await this.fillFirstName('User');
    await this.fillLastName('Test');
    await this.selectGender(gender);
    await this.fillMobileNumber('1234567890');
  }

  async fillDateOfBirth(dateOfBirth: string): Promise<void> {
    await this.dateOfBirthInput.click();
    await this.dateOfBirthInput.fill(dateOfBirth);
    await this.dateOfBirthInput.press('Enter');
  }

  async fillDateViaPicker(day: string, month: string, year: string): Promise<void> {
    await this.dateOfBirthInput.click();
    await this.page.locator('.react-datepicker__month-select').selectOption({ label: month });
    await this.page.locator('.react-datepicker__year-select').selectOption(year);
    const dayCode = String(Number(day)).padStart(3, '0');
    await this.page
      .locator(`.react-datepicker__day--${dayCode}:not(.react-datepicker__day--outside-month)`)
      .click();
  }

  async fillSubjects(subjects: string[]): Promise<void> {
    const firstOption = this.page.locator('.subjects-auto-complete__option').first();
    for (const subject of subjects) {
      await this.subjectsInput.fill(subject);
      try {
        await firstOption.waitFor({ state: 'visible', timeout: 2000 });
        await firstOption.click();
      } catch {
        await this.subjectsInput.press('Escape');
      }
    }
  }

  async removeSubject(subject: string): Promise<void> {
    await this.page
      .locator('.subjects-auto-complete__multi-value')
      .filter({ hasText: subject })
      .locator('.subjects-auto-complete__multi-value__remove')
      .click();
  }

  async verifySelectedSubjects(expectedSubjects: string[]): Promise<void> {
    await expect(this.page.locator('.subjects-auto-complete__multi-value__label')).toHaveText(expectedSubjects);
  }

  async verifyNoSubjectsSelected(): Promise<void> {
    await expect(this.page.locator('.subjects-auto-complete__multi-value')).toHaveCount(0);
  }

  async selectHobbies(hobbies: Hobby[]): Promise<void> {
    for (const hobby of hobbies) {
      await this.hobbiesWrapper.getByText(hobby, { exact: true }).click();
    }
  }

  async verifyHobbiesChecked(hobbies: Array<Hobby | string>): Promise<void> {
    const allHobbies = [Hobby.Sports, Hobby.Reading, Hobby.Music];
    const expectedValues = hobbies.map(String);
    for (const hobby of allHobbies) {
      const checkbox = this.hobbiesWrapper.locator(
        `input[type="checkbox"][value="${this.getHobbyValue(hobby)}"]`,
      );
      if (expectedValues.includes(hobby)) {
        await expect(checkbox).toBeChecked();
      } else {
        await expect(checkbox).not.toBeChecked();
      }
    }
  }

  private getHobbyValue(hobbyName: string): string {
    const mapping: Record<string, string> = { Sports: '1', Reading: '2', Music: '3' };
    return mapping[hobbyName] ?? hobbyName;
  }

  async uploadPicture(filePath: string): Promise<void> {
    await this.uploadPictureInput.setInputFiles(filePath);
  }

  async fillCurrentAddress(currentAddress: string): Promise<void> {
    await this.currentAddressInput.fill(currentAddress);
  }

  async selectState(stateName: string): Promise<void> {
    await this.stateSelect.click();
    await this.page.getByText(stateName, { exact: true }).click();
  }

  async selectCity(cityName: string): Promise<void> {
    await this.verifyCityIsEnabled();
    await this.citySelect.click();
    await this.page.getByText(cityName, { exact: true }).click();
  }

  async verifyCityIsDisabled(): Promise<void> {
    await expect(this.citySelect.locator('input')).toBeDisabled();
  }

  async verifyCityIsEnabled(): Promise<void> {
    await expect(this.citySelect.locator('input')).toBeEnabled();
  }

  async getSelectedCityText(): Promise<string> {
    return (await this.citySelect.locator('[class*="singleValue"]').textContent()) ?? '';
  }

  async verifyCityIsReset(): Promise<void> {
    expect(['', 'Select City']).toContain(await this.getSelectedCityText());
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  async verifyModalVisible(): Promise<void> {
    await expect(this.modalContent).toBeVisible();
    await expect(this.modalTitle).toHaveText('Thanks for submitting the form');
  }

  async getModalValueByLabel(label: string): Promise<string> {
    const rowValue = this.modalTable.locator(
      `tr:has(td:nth-child(1):has-text("${label}")) td:nth-child(2)`,
    );
    await rowValue.waitFor({ state: 'visible' });
    return (await rowValue.textContent())?.trim() ?? '';
  }

  async closeModal(): Promise<void> {
    await this.closeModalButton.click();
    await expect(this.modalContent).not.toBeVisible();
  }

  async verifyFieldColor(
    locators: Locator | Locator[],
    state: ValidationState = ValidationState.Invalid,
  ): Promise<void> {
    const locatorList = Array.isArray(locators) ? locators : [locators];
    for (const locator of locatorList) {
      const checkLabels = locator.locator('.form-check-label');
      if ((await checkLabels.count()) > 0) {
        await expect(checkLabels.first()).toHaveCSS('color', state);
      } else {
        await expect(locator).toHaveCSS('border-color', state);
      }
    }
  }

  async verifyGenderIsChecked(gender: Gender | string): Promise<void> {
    await expect(this.genderWrapper.locator(`input[value="${gender}"]`)).toBeChecked();
  }

  async verifyGenderIsNotChecked(gender: Gender | string): Promise<void> {
    await expect(this.genderWrapper.locator(`input[value="${gender}"]`)).not.toBeChecked();
  }

  async verifyOnlyOneGenderChecked(selectedGender: Gender | string): Promise<void> {
    for (const gender of Object.values(Gender)) {
      if (gender === selectedGender) {
        await this.verifyGenderIsChecked(gender);
      } else {
        await this.verifyGenderIsNotChecked(gender);
      }
    }
  }
}
