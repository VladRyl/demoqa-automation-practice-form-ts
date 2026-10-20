import { expect, test } from '../fixtures/test.fixtures';
import path from 'node:path';
import { DATE_PICKER_CASES } from '../data/date_data';
import { INVALID_EMAILS, VALID_EMAILS } from '../data/email_data';
import { INVALID_FILE_NAMES, VALID_FILE_NAMES } from '../data/file_data';
import { INVALID_NAMES, VALID_NAMES } from '../data/name_data';
import { INVALID_PHONES, VALID_PHONES } from '../data/phone_data';
import { STATE_CITY_MAP } from '../data/state_city_data';
import { Gender, Hobby, ValidationState } from '../enums/enums';

test.describe('Practice Form', () => {

test('all forms filled correctly', async ({ practiceForm }) => {
  await practiceForm.open();
  await practiceForm.verifyStudentRegistrationFormVisible();
  await practiceForm.fillFirstName('User');
  await practiceForm.fillLastName('Test');
  await practiceForm.fillEmail('test.email@test.com');
  await practiceForm.selectGender(Gender.Male);
  await practiceForm.fillMobileNumber('1234567890');
  await practiceForm.fillDateOfBirth('01 Jan 1990');
  await practiceForm.fillSubjects(['Maths', 'Computer']);
  await practiceForm.selectHobbies([Hobby.Sports, Hobby.Reading, Hobby.Music]);
  await practiceForm.uploadPicture(path.resolve(__dirname, '../assets/manul.jpg'));
  await practiceForm.fillCurrentAddress('Street');
  await practiceForm.selectState('NCR');
  await practiceForm.selectCity('Delhi');
  await practiceForm.submit();
  await practiceForm.verifyModalVisible();
  const expected: Record<string, string> = {
    'Student Name': 'User Test', 'Student Email': 'test.email@test.com', Gender: 'Male',
    Mobile: '1234567890', 'Date of Birth': '01 January,1990', Subjects: 'Maths, Computer Science',
    Hobbies: 'Sports, Reading, Music', Picture: 'manul.jpg', Address: 'Street', 'State and City': 'NCR Delhi',
  };
  for (const [label, value] of Object.entries(expected)) expect(await practiceForm.getModalValueByLabel(label)).toBe(value);
  await practiceForm.closeModal();
});

test('mandatory fields filled correctly', async ({ practiceForm }) => {
  await practiceForm.open();
  await practiceForm.fillRequiredFields(Gender.Female);
  await practiceForm.fillDateOfBirth('01 Jan 1990');
  await practiceForm.submit();
  await practiceForm.verifyModalVisible();
  const expected: Record<string, string> = {
    'Student Name': 'User Test', 'Student Email': '', Gender: 'Female', Mobile: '1234567890',
    'Date of Birth': '01 January,1990', Subjects: '', Hobbies: '', Picture: '', Address: '', 'State and City': '',
  };
  for (const [label, value] of Object.entries(expected)) expect(await practiceForm.getModalValueByLabel(label)).toBe(value);
});

test('empty form field colors', async ({ practiceForm }) => {
  await practiceForm.open();
  await practiceForm.submit();
  await practiceForm.verifyFieldColor([practiceForm.firstNameInput, practiceForm.lastNameInput, practiceForm.genderWrapper, practiceForm.mobileNumberInput], ValidationState.Invalid);
  await practiceForm.verifyFieldColor([practiceForm.userEmailInput, practiceForm.dateOfBirthInput, practiceForm.subjectsInput, practiceForm.hobbiesWrapper, practiceForm.uploadPictureInput, practiceForm.currentAddressInput, practiceForm.stateSelect, practiceForm.citySelect], ValidationState.Valid);
});

test('required field colors change after filling', async ({ practiceForm }) => {
  await practiceForm.open();
  await practiceForm.submit();
  const required = [practiceForm.firstNameInput, practiceForm.lastNameInput, practiceForm.genderWrapper, practiceForm.mobileNumberInput];
  await practiceForm.verifyFieldColor(required, ValidationState.Invalid);
  await practiceForm.fillRequiredFields(Gender.Other);
  await practiceForm.verifyFieldColor(required, ValidationState.Valid);
  await practiceForm.fillDateOfBirth('01 Jan 1990');
  await practiceForm.submit();
  await practiceForm.verifyModalVisible();
  expect(await practiceForm.getModalValueByLabel('Student Name')).toBe('User Test');
  expect(await practiceForm.getModalValueByLabel('Gender')).toBe('Other');
});

test.describe('name formats', () => {
  for (const [first, last] of VALID_NAMES) {
    test(`accepts valid name: ${first} ${last}`, async ({ practiceForm }) => {
      await practiceForm.open();
      await practiceForm.fillFirstName(first);
      await practiceForm.fillLastName(last);
      await practiceForm.submit();
      await practiceForm.verifyFieldColor(practiceForm.firstNameInput, ValidationState.Valid);
      await practiceForm.verifyFieldColor(practiceForm.lastNameInput, ValidationState.Valid);
    });
  }
  for (const [first, last] of INVALID_NAMES) {
    test(`rejects invalid name: ${JSON.stringify([first, last])}`, async ({ practiceForm }) => {
      await practiceForm.open();
      await practiceForm.fillFirstName(first);
      await practiceForm.fillLastName(last);
      await practiceForm.submit();
      await practiceForm.verifyFieldColor(practiceForm.firstNameInput, ValidationState.Invalid);
      await practiceForm.verifyFieldColor(practiceForm.lastNameInput, ValidationState.Invalid);
    });
  }
});

test.describe('email formats', () => {
  for (const value of VALID_EMAILS) {
    test(`accepts valid email ${value}`, async ({ practiceForm }) => {
      await practiceForm.open(); await practiceForm.fillEmail(value); await practiceForm.submit();
      await practiceForm.verifyFieldColor(practiceForm.userEmailInput, ValidationState.Valid);
    });
  }
  for (const value of INVALID_EMAILS) {
    test(`rejects invalid email ${value}`, async ({ practiceForm }) => {
      await practiceForm.open(); await practiceForm.fillEmail(value); await practiceForm.submit();
      await practiceForm.verifyFieldColor(practiceForm.userEmailInput, ValidationState.Invalid);
    });
  }
});

test.describe('gender selection', () => {
  for (const value of Object.values(Gender)) {
    test(`selects only ${value}`, async ({ practiceForm }) => {
      await practiceForm.open(); await practiceForm.selectGender(value); await practiceForm.verifyOnlyOneGenderChecked(value);
    });
  }
});

test.describe('phone formats', () => {
  for (const value of VALID_PHONES) {
    test(`accepts phone ${value}`, async ({ practiceForm }) => {
      await practiceForm.open(); await practiceForm.fillMobileNumber(value); await practiceForm.submit();
      await practiceForm.verifyFieldColor(practiceForm.mobileNumberInput, ValidationState.Valid);
    });
  }
  for (const value of INVALID_PHONES) {
    test(`rejects phone ${JSON.stringify(value)}`, async ({ practiceForm }) => {
      await practiceForm.open(); await practiceForm.fillMobileNumber(value); await practiceForm.submit();
      await practiceForm.verifyFieldColor(practiceForm.mobileNumberInput, ValidationState.Invalid);
    });
  }
});

test.describe('date picker', () => {
  for (const [day, month, year, expected] of DATE_PICKER_CASES) {
    test(`selects ${expected}`, async ({ practiceForm }) => {
      await practiceForm.open(); await practiceForm.fillDateViaPicker(day, month, year);
      await expect(practiceForm.dateOfBirthInput).toHaveValue(expected);
    });
  }
  test('does not offer February 31', async ({ page, practiceForm }) => {
    await practiceForm.open();
    await practiceForm.dateOfBirthInput.click();
    await page.locator('.react-datepicker__month-select').selectOption({ label: 'February' });
    await page.locator('.react-datepicker__year-select').selectOption('2024');
    await expect(page.locator('.react-datepicker__day--031:not(.react-datepicker__day--outside-month)')).toHaveCount(0);
  });
});

test('remove selected subject badges', async ({ practiceForm }) => {
  await practiceForm.open(); await practiceForm.fillSubjects(['Math', 'Arts']);
  await practiceForm.removeSubject('Math'); await practiceForm.verifySelectedSubjects(['Arts']);
  await practiceForm.removeSubject('Arts'); await practiceForm.verifyNoSubjectsSelected();
});

test('ignores incorrect subject badge', async ({ practiceForm }) => {
  await practiceForm.open(); await practiceForm.fillSubjects(['XYZ']); await practiceForm.verifyNoSubjectsSelected();
});

test('unselect hobbies', async ({ practiceForm }) => {
  const all = [Hobby.Sports, Hobby.Reading, Hobby.Music];
  await practiceForm.open(); await practiceForm.selectHobbies(all); await practiceForm.verifyHobbiesChecked(all);
  await practiceForm.selectHobbies(all); await practiceForm.verifyHobbiesChecked([]);
});

test.describe('picture upload', () => {
  for (const filename of VALID_FILE_NAMES) {
    test(`uploads valid image ${filename}`, async ({ practiceForm, createTempFile }) => {
      await practiceForm.open();
      const filePath = await createTempFile(filename);
      await practiceForm.uploadPicture(filePath);
      await expect(practiceForm.uploadPictureInput).toHaveValue(`C:\\fakepath\\${filename}`);
      await practiceForm.fillRequiredFields();
      await practiceForm.submit();
      await expect(practiceForm.modalContent).toBeVisible();
      await expect(practiceForm.modalTable).toContainText(filename);
    });
  }
  for (const filename of INVALID_FILE_NAMES) {
    test(`rejects invalid file ${filename}`, async ({ practiceForm, createTempFile }) => {
      await practiceForm.open();
      await practiceForm.uploadPicture(await createTempFile(filename));
      await practiceForm.fillRequiredFields();
      await practiceForm.submit();
      await expect(practiceForm.modalContent).not.toBeVisible();
    });
  }
});

test('current address accepts special characters', async ({ practiceForm }) => {
  const specialAddress = `123/4B 'Main St.' & "Oak Ave."; <script>alert(1)</script> #404! ~\`@$^*()_+=-[]{}\\|/? Київ-Дніпро, вул. Залізнична, 15/A \nApartment ⚡️🏢 🔥 12345-6789`;
  await practiceForm.open(); await practiceForm.fillCurrentAddress(specialAddress);
  await expect(practiceForm.currentAddressInput).toHaveValue(specialAddress);
});

test('city is disabled by default', async ({ practiceForm }) => {
  await practiceForm.open(); await practiceForm.verifyCityIsDisabled();
});

test.describe('state and city cascade', () => {
  for (const [stateName, cities] of Object.entries(STATE_CITY_MAP)) {
    test(`selects a city for ${stateName}`, async ({ practiceForm }) => {
      const selectedCity = cities[0];
      await practiceForm.open(); await practiceForm.verifyCityIsDisabled(); await practiceForm.selectState(stateName);
      await practiceForm.verifyCityIsEnabled(); await practiceForm.selectCity(selectedCity);
      await practiceForm.fillRequiredFields(); await practiceForm.submit();
      expect(await practiceForm.getModalValueByLabel('State and City')).toBe(`${stateName} ${selectedCity}`);
    });
  }
});

test('changing state resets selected city', async ({ practiceForm }) => {
  await practiceForm.open(); await practiceForm.selectState('NCR'); await practiceForm.selectCity('Delhi');
  await practiceForm.selectState('Haryana'); await practiceForm.verifyCityIsReset();
});

test('selecting only a state submits without city', async ({ practiceForm }) => {
  await practiceForm.open(); await practiceForm.selectState('NCR'); await practiceForm.fillRequiredFields(); await practiceForm.submit();
  expect(await practiceForm.getModalValueByLabel('State and City')).toBe('NCR');
});

});
