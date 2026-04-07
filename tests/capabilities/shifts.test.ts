import { test, expect, type Page } from '@playwright/test';

import { ShiftsPage, toShiftDateFormat } from '../../src/pages/ShiftsPage';

const SHIFT_TYPE_INITIAL = 'test';
const SHIFT_TYPE_UPDATED = 'demo';

test.describe.serial('Shifts', () => {
  let shiftsPage: ShiftsPage;

  test.beforeEach(async ({ page }: { page: Page }) => {
    shiftsPage = new ShiftsPage(page);
    await shiftsPage.navigate();
    await expect(page).toHaveURL(/organisation\/shifts/);
    await expect(shiftsPage.pageTitle).toBeVisible();
    await shiftsPage.waitForCalendarToLoad();
  });

  test('should add a new shift', async () => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 10);

    await shiftsPage.addShiftButton.click();

    await shiftsPage.createShift({
      title: 'Automation Shift',
      description: 'Created by automated test',
      shiftType: SHIFT_TYPE_INITIAL,
      resources: ['Artur Gjonaj'],
      date: toShiftDateFormat(targetDate),
      startTime: '08:00',
      endTime: '16:00',
    });

    await shiftsPage.moveSliderToMax();
    await shiftsPage.waitForCalendarToLoad();

    await expect(shiftsPage.shiftEventByTitle(SHIFT_TYPE_INITIAL)).toBeVisible();
  });

  test('should edit an existing shift', async () => {
    await shiftsPage.moveSliderToMax();
    await shiftsPage.waitForCalendarToLoad();

    await shiftsPage.clickShiftEvent(SHIFT_TYPE_INITIAL);
    await shiftsPage.waitForEditDrawer();
    await shiftsPage.page.waitForLoadState('networkidle');

    await shiftsPage.selectShiftType(SHIFT_TYPE_UPDATED);
    await shiftsPage.saveShift();
  });

  test('should delete an existing shift', async () => {
    await shiftsPage.moveSliderToMax();
    await shiftsPage.waitForCalendarToLoad();

    await shiftsPage.clickShiftEvent(SHIFT_TYPE_UPDATED);
    await shiftsPage.waitForEditDrawer();
    await shiftsPage.page.waitForLoadState('networkidle');

    await shiftsPage.deleteShift();
  });
});
